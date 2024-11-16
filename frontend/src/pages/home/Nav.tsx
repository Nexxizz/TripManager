import { Flex, Link, Text, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Box } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {Trip} from "./interfaces/TripADestination";

export const Navigation = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Trip[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Define the convertDate function
    const convertDate = (dateString: string) => {
        const dateParts = dateString.split(".");
        return dateParts.reverse().join("-");
    };

    const handleSearch = async () => {
        try {
            // Check if the search query is a date in the German format
            const datePattern = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
            let query = searchQuery;
            if (datePattern.test(searchQuery)) {
                // If it's a date, convert it to the ISO format
                query = convertDate(searchQuery);
            }

            const response = await axios.get(`https://tripmanager.onrender.com/trips/SearchTrips?q=${query}`);

            if (Array.isArray(response.data)) {
                setSearchResults(response.data);
                setIsOpen(true);
            } else if (response.data instanceof Object) {
                setSearchResults([response.data]);
                setIsOpen(true);
            } else {
                console.error('Error: response data is not an array or an object');
                setSearchResults([]); // Clear search results
            }
        } catch (error) {
            console.error('Error fetching data from /SearchTrips:', error);
            setSearchResults([]); // Clear search results in case of error
        }
    };

    const onClose = () => setIsOpen(false);

    return (
        <Flex as="nav" justifyContent="space-around" background={"lightblue"}>
            <Link as={RouterLink} to="/home">
                <Text fontSize="28px">Home</Text>
            </Link>
            <Link as={RouterLink} to="/addTrip">
                <Text fontSize="28px">Add a new Trip</Text>
            </Link>
            <Link as={RouterLink} to="/addDestination">
                <Text fontSize="28px">Add a new Destination</Text>
            </Link>
            <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trips"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
                width={["400px"]}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Search Results</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {searchResults.map((trip, index) => (
                            <Box key={index} p={4} borderWidth={1} borderRadius="lg">
                                <Text>Name: {trip.name}</Text>
                                <Text>Description: {trip.description}</Text>
                                <Text>Participants: {trip.participants}</Text>
                                <Text>Start Date: {new Date(trip.start_date).toLocaleDateString('de-DE')}</Text>
                                <Text>End Date: {new Date(trip.end_date).toLocaleDateString('de-DE')}</Text>
                                <Text>Destinations: {trip.destinations.length > 0 ? trip.destinations.map((destination) => destination.name).join(', ') : "No destinations"}</Text>
                            </Box>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}