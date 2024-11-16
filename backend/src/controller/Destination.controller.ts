import { Router } from 'express';
import { DI } from '../';
import { Destination } from '../entities/exportHelp'; // Import DestinationDTO
import { Trip } from '../entities/Trip';
import { DestinationSchema } from './schemas';
import axios from 'axios';


const router = Router({ mergeParams: true });


// print all destinations and their trips
router.get('/GetAllDestinations', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const destinations = await em.find(Destination, {}, { populate: ['trips'] });
    const destinationsWithModifiedTrips = destinations.map(destination => {
        const modifiedTrips = destination.trips.toArray().map((trip: any) => {
            const { destinations, ...tripWithoutDestinations } = trip;
            return tripWithoutDestinations;
        });
        return { ...destination, trips: modifiedTrips };
    });
    res.status(200).json(destinationsWithModifiedTrips);
});


router.post('/CreateDestination', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    try {
        const existingDestination = await em.findOne(Destination, { name: req.body.name });
        if (existingDestination) {
            return res.status(400).json({ error: 'A destination with this name already exists.' });
        }
        if (!req.body.trips || req.body.trips.length === 0) {
            return res.status(400).json({ error: 'A destination must have at least one trip.' });
        }
        const destination = new Destination(req.body);
        for (const trip of req.body.trips) {
            const existingTrip = await em.findOne(Trip, { id: trip.id });
            if (!existingTrip) {
                return res.status(400).json({ error: `A trip with the id ${trip.id} does not exist.` });
            }
            destination.trips.add(existingTrip);
        }
        const destinationWithTrips = { ...req.body, trips: destination.trips.getItems() };
        await DestinationSchema.validate(destinationWithTrips); // Validate the schema after adding the trips
        await em.persistAndFlush(destination);
        await em.populate(destination, ['trips']); // Populate the trips field
        res.status(201).json(destination);
    } catch (error: any) {
        return res.status(400).json({ error: error.errors });
    }
});

router.delete('/DeleteDestination/:id', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const destination = await em.findOne(Destination, { id: req.params.id });
    if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
    }
    await em.removeAndFlush(destination);
    res.status(200).json(destination);
});

router.put('/UpdateDestination/:id', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    try {
        await DestinationSchema.validate(req.body);
        const destination = await em.findOne(Destination, { id: req.params.id });
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }
        if (req.body.trips) {
            for (const tripDTO of req.body.trips) {
                const existingTrip = await em.findOne(Trip, { name: tripDTO.name });
                if (existingTrip && existingTrip.id !== tripDTO.id) {
                    return res.status(400).json({ error: `A trip with the name ${tripDTO.name} already exists.` });
                }
            }
        }
        em.assign(destination, req.body);
        await em.persistAndFlush(destination);
        res.status(200).json(destination);
    } catch (error: any) {
        if (error.code === '23505') { // PostgreSQL error code for unique_violation
            return res.status(400).json({ error: 'A destination with this name already exists.' });
        }
        return res.status(400).json({ error: error.errors });
    }
});

router.put('/AddDestinationToTrip/:tripId/:destinationId', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const trip = await em.findOne(Trip, { id: req.params.tripId });
    if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
    }
    const destination = await em.findOne(Destination, { id: req.params.destinationId });
    if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
    }
    trip.destinations.add(destination);
    await em.persistAndFlush(trip);
    await em.populate(trip, ['destinations']);
    res.status(200).json(trip);
});

router.get('/GetDestinationByName/:name', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const destination = await em.findOne(Destination, { name: req.params.name });
    if (!destination) {
        return res.status(200).json({ message: 'No destination found with this name.' });
    }
    res.status(200).json(destination);
});

// Freestyle Task 1
// Route to like a destination
router.put('/LikeDestination/:id', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const destination = await em.findOne(Destination, { id: req.params.id });
    if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
    }
    destination.likes += 1;
    await em.persistAndFlush(destination);
    res.status(200).json(destination);
});

// Freestyle Task 1
// Route to get destinations sorted by likes
router.get('/MostPopularDestinations', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const destinations = await em.find(Destination, {}, { orderBy: { likes: 'desc' } });
    res.status(200).json(destinations);
});

// Freestyle Task 2
// Route to get weather forecast for a destination
router.get('/WeatherForecast/:id', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const destination = await em.findOne(Destination, { id: req.params.id });
    if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
    }

    try {
        // Fetch weather data from wttr.in API
        const response = await axios.get(`http://wttr.in/${destination.name}?format=%C+%t`);
        const weatherData = response.data;

        // Return the weather data
        res.status(200).json({weather: weatherData});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export const destinationRouter = router