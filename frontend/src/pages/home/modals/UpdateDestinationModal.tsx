import React, {ChangeEvent, useEffect, useState} from 'react'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, useDisclosure } from '@chakra-ui/react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Destination } from '../interfaces/TripADestination';

function UpdateDestination({ destination }: { destination: Destination }) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const [error, setError] = useState<string>('');
    const [initialName, setInitialName] = useState<string>('');

    useEffect(() => {
        setInitialName(destination.name);
    }, []);

    const validateDestinationName = async (e: ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        const newValue = e.target.value;
        setFieldValue('name', newValue);
        setError('');

        // If the new value is the same as the initial name, no need to validate
        if (newValue.trim() === initialName.trim()) return;

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
        <>
            <Button colorScheme="green" onClick={onOpen}>Update</Button>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Destination</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Formik
                            initialValues={destination}
                            validationSchema={Yup.object({
                                name: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for name').required(),
                                description: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for description').required(),
                                photos: Yup.string().matches(/^[a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]*$/, 'Not Valid URL for photos').required(),
                                activities: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for activities').required(),
                                start_date: Yup.date().required(),
                                end_date: Yup.date().required()
                            })}
                            onSubmit={(values, { setSubmitting }) => {
                                console.log(values);
                                fetch(`https://tripmanager.onrender.com/destinations/UpdateDestination/${destination.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(values),
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.error) {
                                            setError(data.error);
                                        } else {
                                            // Handle successful update
                                            onClose();
                                            window.location.reload();
                                        }
                                    })
                                    .catch(() => {
                                        setError('Error connecting to the server');
                                    })
                                    .finally(() => {
                                        setSubmitting(false);
                                    });
                            }}
                        >
                            {({ setFieldValue }) => (
                                <Form>
                                    <FormControl>
                                        <FormLabel>Name</FormLabel>
                                        <Field as={Input} name="name" type="text" size="lg" onChange={(e: ChangeEvent<HTMLInputElement>) => validateDestinationName(e, setFieldValue)} />
                                        <div>
                                            {error && <div>{error}</div>}
                                            <ErrorMessage name="name" component="div" />
                                        </div>
                                    </FormControl>

                                    <FormControl mt={4}>
                                        <FormLabel>Description</FormLabel>
                                        <Field as={Input} name="description" type="text" />
                                        <ErrorMessage name="description" component="div" />
                                    </FormControl>

                                    <FormControl mt={4}>
                                        <FormLabel>Photos URL</FormLabel>
                                        <Field as={Input} name="photos" type="text" />
                                        <ErrorMessage name="photos" component="div" />
                                    </FormControl>

                                    <FormControl mt={4}>
                                        <FormLabel>Activities</FormLabel>
                                        <Field as={Input} name="activities" type="text" />
                                        <ErrorMessage name="activities" component="div" />
                                    </FormControl>

                                    <FormControl mt={4}>
                                        <FormLabel>Start Date</FormLabel>
                                        <Field as={Input} name="start_date" type="date" />
                                        <ErrorMessage name="start_date" component="div" />
                                    </FormControl>

                                    <FormControl mt={4}>
                                        <FormLabel>End Date</FormLabel>
                                        <Field as={Input} name="end_date" type="date" />
                                        <ErrorMessage name="end_date" component="div" />
                                    </FormControl>
                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} type="submit">
                                            Save
                                        </Button>
                                        <Button onClick={onClose}>Cancel</Button>
                                    </ModalFooter>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateDestination;