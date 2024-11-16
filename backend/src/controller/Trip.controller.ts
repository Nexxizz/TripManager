import { Router } from 'express';
import { DI } from '../';
import { Trip } from '../entities/Trip';
import { Destination } from '../entities/exportHelp';
import { TripSchema } from './schemas';



const router = Router({ mergeParams: true });

router.get('/GetAllTrips', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const trips = await em.find(Trip, {}, { populate: ['destinations'] });
    res.status(200).json(trips);
});

router.post('/CreateTrip', async (req, res) => {
    const em = DI.orm.em.fork();
    try {
        await TripSchema.validate(req.body);
        const existingTrip = await em.findOne(Trip, { name: req.body.name });
        if (existingTrip) {
            return res.status(400).json({ error: `A trip with the name ${req.body.name} already exists.` });
        }
        const trip = new Trip(req.body);
        if (req.body.destinations) {
            for (const destinationDTO of req.body.destinations) {
                const destination = new Destination(destinationDTO);
                const existingDestination = await em.findOne(Destination, { name: destinationDTO.name });
                if (existingDestination) {
                    return res.status(400).json({ error: `A destination with the name ${destinationDTO.name} already exists.` });
                }
                trip.destinations.add(destination);
            }
        }
        await em.persistAndFlush(trip);
        await em.populate(trip, ['destinations']);
        res.status(201).json(trip);
    } catch (error: any) {
        return res.status(400).json({ error: error.errors });
    }
});

router.delete('/DeleteTrip/:id', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const trip = await em.findOne(Trip, { id: req.params.id });
    if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
    }
    await em.removeAndFlush(trip);
    res.status(200).json(trip);
});

router.put('/UpdateTrip/:id', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    try {
        await TripSchema.validate(req.body);
        const trip = await em.findOne(Trip, { id: req.params.id });
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        if (req.body.destinations) {
            for (const destinationDTO of req.body.destinations) {
                const existingDestination = await em.findOne(Destination, { name: destinationDTO.name });
                if (existingDestination && existingDestination.id !== destinationDTO.id) {
                    return res.status(400).json({ error: `A destination with the name ${destinationDTO.name} already exists.` });
                }
            }
        }
        em.assign(trip, req.body);
        await em.persistAndFlush(trip);
        res.status(200).json(trip);
    } catch (error: any) {
        if (error.code === '23505') { // PostgreSQL error code for unique_violation
            return res.status(400).json({ error: 'A trip with this name already exists.' });
        }
        return res.status(400).json({ error: error.errors });
    }
});

router.put('/AddMultipleDestinationsToTrip/:tripId', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const trip = await em.findOne(Trip, { id: req.params.tripId });
    if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
    }
    const destinationIds = req.body.destinationIds;
    for (const destinationId of destinationIds) {
        const destination = await em.findOne(Destination, { id: destinationId });
        if (!destination) {
            return res.status(404).json({ error: `Destination with id ${destinationId} not found` });
        }
        trip.destinations.add(destination);
    }
    await em.persistAndFlush(trip);
    await em.populate(trip, ['destinations']);
    res.status(200).json(trip);
});

router.put('/RemoveMultipleDestinationsFromTrip/:tripId', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const trip = await em.findOne(Trip, { id: req.params.tripId }, { populate: ['destinations'] }); // Populate the destinations relation
    if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
    }
    const destinationIds = req.body.destinationIds;
    for (const destinationId of destinationIds) {
        const destination = trip.destinations.getItems().find(d => d.id === destinationId);
        if (!destination) {
            return res.status(404).json({ error: `Destination with id ${destinationId} not found in trip` });
        }
        trip.destinations.remove(destination);
    }
    await em.persistAndFlush(trip);
    await em.populate(trip, ['destinations']);
    res.status(200).json(trip);
});

router.get('/GetTripsByDestination/:destinationName', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const destination = await em.findOne(Destination, { name: req.params.destinationName });
    if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
    }
    const trips = await em.find(Trip, { destinations: destination }, { populate: ['destinations'] });
    res.status(200).json(trips);
});

router.get('/SearchTrips', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const searchQuery = req.query.q;
    if (typeof searchQuery !== 'string') {
        return res.status(400).json({ error: 'Invalid search query' });
    }
    const searchDate = new Date(searchQuery);
    if (!isNaN(searchDate.getTime())) {
        const trips = await em.find(Trip, {
            $or: [
                { name: { $ilike: `%${searchQuery}%` } },
                { start_date: { $gte: searchDate, $lt: new Date(searchDate.getTime() + 24*60*60*1000) } }
            ]
        }, { populate: ['destinations'] });
        res.status(200).json(trips);
    } else {
        const trips = await em.find(Trip, { name: { $ilike: `%${searchQuery}%` } }, { populate: ['destinations'] });
        res.status(200).json(trips);
    }
});

router.get('/:id', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const trip = await em.findOne(Trip, { id: req.params.id });
    if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
    }
    res.status(200).json(trip);
});

router.get('/GetTripByName/:name', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const trip = await em.findOne(Trip, { name: req.params.name });
    if (!trip) {
        return res.status(200).json({ message: 'Trip not found' });
    }
    res.status(200).json(trip);
});

router.get('/GetTripDestinations/:tripId', async (req, res) => {
    const em = DI.orm.em.fork(); // Create a new context-bound EntityManager instance
    const trip = await em.findOne(Trip, { id: req.params.tripId }, { populate: ['destinations'] });
    if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
    }
    res.status(200).json(trip.destinations);
});

export const tripRouter = router;