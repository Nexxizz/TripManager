import { useState, useEffect } from 'react';
import { Button, Modal, Checkbox, Stack, ModalOverlay, ModalContent, ModalHeader,  ModalCloseButton, ModalBody, ModalFooter} from '@chakra-ui/react';

function DelDestinationsModal({ tripId }: { tripId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [destinations, setDestinations] = useState<{ id: string, name: string }[]>([]);
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Fetch all destinations when the component mounts
    useEffect(() => {
        // Fetch the current destinations of the trip
        fetch(`https://tripmanager.onrender.com/trips/GetTripDestinations/${tripId}`)
            .then(response => response.json())
            .then(currentDestinations => setDestinations(currentDestinations));
    }, []);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        setErrorMessage(''); // Reset the error message
        setSelectedDestinations([]); // Clear the selected destinations
    };

    const handleDestinationSelect = (destinationId: string) => {
        setSelectedDestinations(prev => {
            if (!prev.includes(destinationId)) {
                return [...prev, destinationId];
            }
            return prev;
        });
        setErrorMessage(''); // Reset the error message
    };

    const handleRemoveDestinations = async () => {
        // Find the names of the selected destinations that are not part of the trip's destinations
        const notAddedDestinations = selectedDestinations
            .filter(destinationId => !destinations.map(destination => destination.id).includes(destinationId))
            .map(destinationId => destinations.find(destination => destination.id === destinationId)?.name)
            .filter(Boolean);

        if (notAddedDestinations.length > 0) {
            setErrorMessage(`The following destinations are not part of the trip: ${notAddedDestinations.join(', ')}`);
            return;
        }

        let destinationsWithNoOtherTrips = [];

        // For each selected destination, fetch all trips
        for (let i = 0; i < selectedDestinations.length; i++) {
            const destinationId = selectedDestinations[i];
            const destinationName = destinations.find(destination => destination.id === destinationId)?.name;
            const response = await fetch(`https://tripmanager.onrender.com/trips/GetTripsByDestination/${destinationName}`);
            const destinationTrips = await response.json();

            // If the destination has no other trips, add it to the list
            if (destinationTrips.length === 1) {
                destinationsWithNoOtherTrips.push(destinationName);
            }
        }

        // If there are any destinations that would have no trips, set an error message and return
        if (destinationsWithNoOtherTrips.length > 0) {
            setErrorMessage(`Cannot remove the following destinations because they would have no trips: ${destinationsWithNoOtherTrips.join(', ')}`);
            return;
        }

        // If no destination has only this trip, remove the destinations from the trip
        fetch(`https://tripmanager.onrender.com/trips/RemoveMultipleDestinationsFromTrip/${tripId}`, {
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
                        setErrorMessage('The trip with the provided ID could not be found.');
                    } else {
                        setErrorMessage(data.error);
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
                setErrorMessage('Error: ' + error);
            });
    };

    return (
        <>
            <Button colorScheme="yellow" onClick={handleOpen}>Remove Destinations</Button>

            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Remove Destinations</ModalHeader>
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
                        <Button colorScheme="blue" mr={3} onClick={handleRemoveDestinations}>
                            Remove
                        </Button>
                        <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default DelDestinationsModal;