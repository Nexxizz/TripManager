import { Box, Text, HStack, Image, Button } from "@chakra-ui/react";
import { Trip, Destination } from "../interfaces/TripADestination.tsx";
import { useState } from 'react';
import UpdateTripModal from '../modals/UpdateTripModal';
import AddDestinationsModal from '../modals/AddDestinationsToTripModal.tsx';
import DelDestinationsModal from "../modals/DelDestinationsFromTripModal.tsx";

export const AllTripsCard = ({
                                 data
                             }: {
    data: Trip[];
}) => {
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

    const deleteTrip = async (id: string) => {
        // Find the trip by id
        const trip = data.find((trip) => trip.id === id);

        // Check if the trip has no destinations
        if (trip && trip.destinations && trip.destinations.length > 0) {
            let destinationsWithNoOtherTrips = [];

            // For each destination of the trip, fetch all trips
            for (let i = 0; i < trip.destinations.length; i++) {
                const destinationName = trip.destinations[i].name;
                const response = await fetch(`https://tripmanager.onrender.com/trips/GetTripsByDestination/${destinationName}`);
                const destinationTrips = await response.json();

                // If the destination has no other trips, add it to the list
                if (destinationTrips.length === 1) {
                    destinationsWithNoOtherTrips.push(destinationName);
                }
            }

            // If there are any destinations that would have no trips, set an error message and return
            if (destinationsWithNoOtherTrips.length > 0) {
                setErrorMessages(prevState => ({ ...prevState, [id]: `Cannot delete trip because the following destinations would have no trips: ${destinationsWithNoOtherTrips.join(', ')}` }));
                return;
            }
        }

        // If all destinations have other trips, delete the trip
        const response = await fetch(`https://tripmanager.onrender.com/trips/DeleteTrip/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            // Refresh the page after successful deletion
            window.location.reload();
        } else {
            // Set the error message for the specific trip
            setErrorMessages(prevState => ({ ...prevState, [id]: 'Error deleting trip.' }));
        }
    };

    return (
        <HStack spacing={4}>
            {data.map((trip) => {
                const startDate = new Date(trip.start_date);
                const endDate = new Date(trip.end_date);
                const basicBoxStyles = {
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    boxSize: '670px',
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
                    <Box sx={basicBoxStyles} key={trip.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} width="full">
                        <Image  boxSize="350px" objectFit="cover" src={trip.image} alt={trip.name}  mx="auto" border={"4px"}/>
                        <Text>Name: {trip.name}</Text>
                        <Text>Description: {trip.description}</Text>
                        <Text>Participants: {trip.participants}</Text>
                        <Text>Start Date: {startDate.toLocaleDateString('de-DE')}</Text>
                        <Text>End Date: {endDate.toLocaleDateString('de-DE')}</Text>
                        <Text height="70px">Destinations: {trip.destinations.length > 0 ? trip.destinations.map((destination: Destination) => destination.name).join(', ') : "No destinations"}</Text>
                        <AddDestinationsModal tripId={trip.id}/>
                        <DelDestinationsModal tripId={trip.id}/>
                        <UpdateTripModal trip={trip}/>
                        <Button colorScheme="red" onClick={() => deleteTrip(trip.id)}>Delete</Button>
                        {errorMessages[trip.id] && <Text color="red">{errorMessages[trip.id]}</Text>}
                    </Box>
                );
            })}
        </HStack>
    );
};