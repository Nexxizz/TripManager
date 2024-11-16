import * as Yup from 'yup';


export const TripSchema = Yup.object().shape({
    name: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for name').required(),
    description: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for description').required(),
    image: Yup.string().matches(/^[a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]*$/, 'Not Valid URL for images').required(),
    participants: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for participants').required(),
    start_date: Yup.date().required(),
    end_date: Yup.date().required()
});

export const DestinationSchema = Yup.object().shape({
    name: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for name').required(),
    description: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for description').required(),
    activities: Yup.string().matches(/^[a-zA-Z0-9\s,]*$/, 'Only alphabetic characters, numbers, spaces and commas are allowed for activities').required(),
    photos: Yup.string().matches(/^[a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]*$/, 'Not Valid URL for photos').required(),
    start_date: Yup.date().required(),
    end_date: Yup.date().required(),
    trips: Yup.array().of(TripSchema),
});