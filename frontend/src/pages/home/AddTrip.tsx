import {ChangeEvent, useState} from 'react';
import { Button, Center, VStack, FormLabel, Input, Box } from '@chakra-ui/react';
import { Trip } from './interfaces/TripADestination';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

export const AddTrip = () => {
    const [trip] = useState<Trip>({
        id: "",
        name: '',
        description: '',
        image: '',
        participants: '',
        start_date: new Date(),
        end_date: new Date(),
        destinations: []
    });
    const [error, setError] = useState<string>('');


    const navigate = useNavigate();

    const addTrip = async (trip: Trip) => {
        console.log(trip)
        const response = await fetch('https://tripmanager.onrender.com/trips/CreateTrip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trip),
        });
        if (response.ok) {
            navigate('/');
        }
    };

    const validateTripName = async (e: ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        const newValue = e.target.value;
        setFieldValue('name', newValue); // Set the Formik field value
        setError('');

        if (newValue.trim() === '') return;

        try {
            const response = await fetch(`https://tripmanager.onrender.com/trips/GetTripByName/${newValue}`);
            if (response.ok) {
                const data = await response.json();
                if (data.name) {
                    setError('Trip already exists');
                }
            } else {
                setError('Failed to validate the trip');
            }
        } catch (error) {
            setError('Error connecting to the server');
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
        }
    }
    return (
        <div>
            <Center>
                <Formik
                    initialValues={trip}
                    validationSchema={Yup.object({
                        name: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for name').required(),
                        description: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for description').required(),
                        image: Yup.string().matches(/^[a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]*$/, 'Not Valid URL for images').required(),
                        participants: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for participants').required(),
                        start_date: Yup.date().required(),
                        end_date: Yup.date().required()
                    })}
                    onSubmit={(values) => {
                        addTrip(values);
                    }}
                >
                    {({ setFieldValue }) => (
                    <Box sx={basicBoxStyles} marginTop={"2rem"}>
                        <Form>
                            <VStack spacing={4}>
                                <FormLabel fontSize="lg">Name</FormLabel>
                                <Field as={Input} name="name" type="text" size="lg" onChange={(e: ChangeEvent<HTMLInputElement>) => validateTripName(e, setFieldValue)} />
                                {error ? <div>{error}</div> : <ErrorMessage name="name" component="div" />}
                                <FormLabel fontSize="lg">Description</FormLabel>
                                <Input as={Field} name="description" type="text" size="lg" />
                                <ErrorMessage name="description" />
                                <FormLabel fontSize="lg">Image URL</FormLabel>
                                <Input as={Field} name="image" type="text" size="lg" />
                                <ErrorMessage name="image" />
                                <FormLabel fontSize="lg">Participants</FormLabel>
                                <Input as={Field} name="participants" type="text" size="lg" />
                                <ErrorMessage name="participants" />
                                <FormLabel fontSize="lg">Start Date</FormLabel>
                                <Input as={Field} name="start_date" type="date" size="lg" />
                                <ErrorMessage name="start_date" />
                                <FormLabel fontSize="lg">End Date</FormLabel>
                                <Input as={Field} name="end_date" type="date" size="lg" />
                                <ErrorMessage name="end_date" />
                                <Button colorScheme="blue" size="lg" type="submit" marginTop={"2rem"}>Add Trip</Button>
                            </VStack>
                        </Form>
                    </Box>
                    )}
                </Formik>
            </Center>
        </div>
    );
};