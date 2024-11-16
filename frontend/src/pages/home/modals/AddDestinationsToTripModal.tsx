import { useState, useEffect } from 'react';
import { Button, Modal, Checkbox, Stack, ModalOverlay, ModalContent, ModalHeader,  ModalCloseButton, ModalBody, ModalFooter} from '@chakra-ui/react';

function AddDestinationsModal({ tripId }: { tripId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [destinations, setDestinations] = useState<{ id: string, name: string }[]>([]);
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Fetch all destinations when the component mounts
    useEffect(() => {
        fetch('https://tripmanager.onrender.com/destinations/GetAllDestinations')
            .then(response => response.json())
            .then(data => setDestinations(data));
    }, []);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        setErrorMessage(''); // Reset the error message
        setSelectedDestinations([]); // Clear the selected destinations
    };


    const handleDestinationSelect = (destinationId: string) => {
        setSelectedDestinations(prev => {
            if (prev.includes(destinationId)) {
                // If the destination is already selected, remove it from the selected destinations
                return prev.filter(id => id !== destinationId);
            } else {
                // Otherwise, add it to the selected destinations
                return [...prev, destinationId];
            }
        });
        // Reset the error message whenever a destination is selected or deselected
        setErrorMessage('');
    };

    const handleAddDestinations = async () => {
        // Fetch the current destinations of the trip
        const response = await fetch(`https://tripmanager.onrender.com/trips/GetTripDestinations/${tripId}`);
        const currentDestinations = await response.json();

        // Map currentDestinations to an array of destination IDs
        const currentDestinationIds = currentDestinations.map((destination: { id: string }) => destination.id);

        // Find the names of the selected destinations that are already part of the trip's destinations
        const alreadyAddedDestinations = selectedDestinations
            .filter(destinationId => currentDestinationIds.includes(destinationId))
            .map(destinationId => destinations.find(destination => destination.id === destinationId)?.name)
            .filter(Boolean);

        if (alreadyAddedDestinations.length > 0) {
            setErrorMessage(`The following destinations are already part of the trip: ${alreadyAddedDestinations.join(', ')}`);
            return;
        }
        fetch(`https://tripmanager.onrender.com/trips/AddMultipleDestinationsToTrip/${tripId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ destinationIds: selectedDestinations }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    if (data.error === 'Trip not found') {
                        console.error('The trip with the provided ID could not be found.');
                    } else {
                        console.error(data.error);
                    }
                } else {
                    // Handle successful update
                    console.log(data);
                    handleClose();
                    setSelectedDestinations([]); // Clear the selected destinations
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <>
            <Button colorScheme="blue" onClick={handleOpen}>Add Destinations</Button>

            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Destinations</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={3}>
                            {destinations.map(destination => (
                                <Checkbox key={destination.id} onChange={() => handleDestinationSelect(destination.id)}>
                                    {destination.name}
                                </Checkbox>
                            ))}
                        </Stack>
                        {errorMessage && <div>{errorMessage}</div>}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleAddDestinations}>
                            Add
                        </Button>
                        <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddDestinationsModal;