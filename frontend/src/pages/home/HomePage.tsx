import { GetAllTrips } from './components/getAllTrips';
import {GetAllDestinations} from "./components/getAllDestinations.tsx";

export const HomePage = () => {
    return (
        <div>
            <GetAllTrips/>
            <GetAllDestinations/>
        </div>
    );
}