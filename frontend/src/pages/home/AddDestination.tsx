import {useState, useEffect, ChangeEvent} from 'react';
import { Button, Center, VStack, FormLabel, Input, Select, Box } from '@chakra-ui/react';
import { Trip, Destination } from './interfaces/TripADestination';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

export const AddDestination = () => {
    const [destination] = useState<Destination>({
        trips: [],
        id: "",
        name: '',
        description: '',
        activities: '',
        photos: '',
        start_date: new Date(),
        end_date: new Date(),
    });

    const [trips, setTrips] = useState<Trip[]>([]);
    const [photo1] = useState('');
    const [photo2] = useState('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrips = async () => {
            const response = await fetch('https://tripmanager.onrender.com/trips/GetAllTrips');
            const data = await response.json();
            setTrips(data);
        };

        fetchTrips();
    }, []);

    const addDestination = async (values: any) => {
        // Concatenate photo1 and photo2 with a comma in between
        const photos = `${values.photo1},${values.photo2}`;

        // Create an array of trip objects that only contain the id field
        const tripObjects = values.trips.map((tripId: string) => ({ id: tripId }));

        // Exclude the id field from the values
        const { id, ...otherValues } = values;

        const destination: Destination = {
            ...otherValues,
            photos,  // Use the concatenated photos string
            trips: tripObjects,  // Send the trip objects with only the id field
        };

        const response = await fetch('https://tripmanager.onrender.com/destinations/CreateDestination', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(destination),
        });
        if (response.ok) {
            navigate('/');
        }
    };


    const basicBoxStyles = {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxSize: '400px',
        fontWeight: 'bold',
        input: {
            fontWeight: 'bold',
            border: '3px solid',

        },
        button: {
            fontWeight: 'bold',
            fontSize: '1.5rem',
            border: '1px solid',
        },
        select: {
            fontSize: '1.5rem',
            height: '10rem',
        }
    }
    const validateDestinationName = async (e :ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        const newValue = e.target.value;
        setFieldValue('name', newValue); // Set the Formik field value
        setError('');

        if (newValue.trim() === '') return;

        try {
            const response = await fetch(`https://tripmanager.onrender.com/destinations/GetDestinationByName/${newValue}`);
            if (response.ok) {
                const data = await response.json();
                if (data.name) {
                    setError('Destination already exists');
                }
            } else {
                setError('Failed to validate the destination');
            }
        } catch (error) {
            setError('Error connecting to the server');
        }
    };

    return (
        <div>
            <Center>
                <Formik
                    initialValues={{
                        ...destination,
                        photo1,
                        photo2
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for name').required(),
                        description: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for description').required(),
                        activities: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for activities').required(),
                        photo1: Yup.string().matches(/^[a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]*$/, 'Not Valid URL for photos').required('Required'),
                        photo2: Yup.string().matches(/^[a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]*$/, 'Not Valid URL for photos').required('Required'),
                        start_date: Yup.date().required(),
                        end_date: Yup.date().required(),
                        trips: Yup.array().min(1, 'At least one trip is required').required('Required'),
                    })}
                    onSubmit={(values) => {
                            addDestination(values);

                    }}
                >
                    {({ setFieldValue }) => (
                        <Box sx={basicBoxStyles} marginTop={"2rem"}>

                            <Form>
                                <VStack spacing={4}>
                                    <FormLabel fontSize="lg">Name</FormLabel>
                                    <Field as={Input} name="name" type="text" size="lg" onChange={(e: ChangeEvent<HTMLInputElement>) => validateDestinationName(e, setFieldValue)} />
                                    {error ? <div>{error}</div> : <ErrorMessage name="name" component="div" />}
                                    <FormLabel fontSize="lg">Description</FormLabel>
                                    <Field as={Input} name="description" type="text" size="lg" />
                                    <ErrorMessage name="description" />
                                    <FormLabel fontSize="lg">Activities</FormLabel>
                                    <Field as={Input} name="activities" type="text" size="lg" />
                                    <ErrorMessage name="activities" />
                                    <FormLabel fontSize="lg">URL of Photo 1</FormLabel>
                                    <Field as={Input} name="photo1" type="text" size="lg" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('photo1', e.target.value)} />
                                    <ErrorMessage name="photo1" />
                                    <FormLabel fontSize="lg">URL of Photo 2</FormLabel>
                                    <Field as={Input} name="photo2" type="text" size="lg" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('photo2', e.target.value)} />
                                    <ErrorMessage name="photo2" />
                                    <FormLabel fontSize="lg">Start Date</FormLabel>
                                    <Field as={Input} name="start_date" type="date" size="lg" />
                                    <ErrorMessage name="start_date" />
                                    <FormLabel fontSize="lg">End Date</FormLabel>
                                    <Field as={Input} name="end_date" type="date" size="lg" />
                                    <ErrorMessage name="end_date" />
                                    <FormLabel fontSize="lg">Trips</FormLabel>
                                    <Field as={Select} name="trips" multiple size="lg">
                                        {trips.map((trip) => (
                                            <option key={trip.id} value={trip.id}>{trip.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="trips" />
                                    <Button colorScheme="blue" size="lg" type="submit" marginTop={"2rem"}>Add Destination</Button>
                                </VStack>

                            </Form>
                        </Box>
                    )}
                </Formik>
            </Center>
        </div>
    );
};