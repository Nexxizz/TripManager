export interface Trip {
    id: string;
    name: string;
    description: string;
    image: string;
    participants: string;
    start_date: Date;
    end_date: Date;
    destinations: Destination[];
}

export interface Destination {
    trips: any;
    id: string;
    name: string;
    description: string;
    activities: string;
    photos: string;
    start_date: Date;
    end_date: Date;
}