import { Box, Text, HStack, Image, Button } from "@chakra-ui/react";
import { Destination, Trip } from "../interfaces/TripADestination.tsx";
import UpdateDestination from '../modals/UpdateDestinationModal.tsx';

export const AllDestinationsCards = ({
                                         data
                                     }: {
    data: Destination[];
}) => {
    const deleteDestination = async (id: string) => {
        const response = await fetch(`https://tripmanager.onrender.com/destinations/DeleteDestination/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            // Refresh the page after successful deletion
            window.location.reload();
        }
    };

    const basicBoxStyles = {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxSize: '600px',
        fontWeight: 'bold',
        input: {
            fontWeight: 'bold',
            border: '3px solid',

        },
        button: {
            fontWeight: 'bold',
            border: '1px solid',
            marginLeft: '1rem'

        },
        select: {
            fontSize: '1.5rem',
        }
    }

    return (
            <HStack spacing={4}>
                {data.map((destination) => {
                    const startDate = new Date(destination.start_date);
                    const endDate = new Date(destination.end_date);
                    const photos = destination.photos.split(',');
                    return (
                        <Box sx={basicBoxStyles} key={destination.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} width="full">
                            <HStack spacing={4}>
                                {photos.map((photo, index) => (
                                    <Image key={index} boxSize="200px" objectFit="cover" src={photo} alt={`${destination.name} photo ${index + 1}`}  mx="auto"  border={"4px"}/>
                                ))}
                            </HStack>
                            <Text fontWeight="bold">Name: {destination.name}</Text>
                            <Text>Description: {destination.description}</Text>
                            <Text>Activities: {destination.activities}</Text>
                            <Text>Start Date: {startDate.toLocaleDateString('de-DE')}</Text>
                            <Text>End Date: {endDate.toLocaleDateString('de-DE')}</Text>
                            <Text height="70px">Trips: {destination.trips.length > 0 ? destination.trips.map((trip: Trip) => trip.name).join(', ') : "No trips"}</Text>
                            <UpdateDestination destination={destination} />
                            <Button colorScheme="red" onClick={() => deleteDestination(destination.id)}>Delete</Button>
                        </Box>
                    );
                })}
            </HStack>
    );
};