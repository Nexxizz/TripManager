import { Entity, PrimaryKey, Property, ManyToMany, Collection, Unique } from '@mikro-orm/core';
import { Trip, TripDTO } from './Trip';
import { v4 } from 'uuid';


@Entity()
export class Destination {
    @PrimaryKey()
    id: string = v4();

    @Unique()
    @Property()
    name!: string;

    @Property()
    description!: string;

    @Property()
    activities!: string;

    @Property()
    photos!: string;

    @Property()
    start_date!: Date;

    @Property()
    end_date!: Date;

    @Property({ nullable: true })
    likes: number = 0;

    @ManyToMany(() => Trip, (e) => e.destinations)
    trips = new Collection<Trip>(this);

    constructor({ name, description, activities, photos, start_date, end_date }: DestinationDTO){
        this.name = name;
        this.description = description;
        this.activities = activities;
        this.photos = photos;
        this.start_date = start_date;
        this.end_date = end_date;
    }
}


export type DestinationDTO = {
    name: string;
    description: string;
    activities: string;
    photos: string;
    start_date: Date;
    end_date: Date;
    trips: TripDTO[];
};