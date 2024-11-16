import { useState, useEffect } from 'react';
import {AllTripsCard} from '../cards/AllTripsCard.tsx';
import { Trip } from '../interfaces/TripADestination';

export const GetAllTrips = () => {
    const [data, setData] = useState<Trip[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3000/trips/GetAllTrips');
            const data = await response.json();
            setData(data);
        };

        fetchData();
    }, []);

    return <AllTripsCard data={data} />;
};