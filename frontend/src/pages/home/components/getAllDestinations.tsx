// i want to get all destinations from the API
import  { useEffect, useState } from 'react';
import { Destination } from '../interfaces/TripADestination';
import { AllDestinationsCards } from '../cards/AllDestinationsCard.tsx';

export const GetAllDestinations = () => {
    const [data, setData] = useState<Destination[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3000/destinations/GetAllDestinations');
            const data = await response.json();
            setData(data);
        };

        fetchData();
    }, []);

    return <AllDestinationsCards data={data} />;
};