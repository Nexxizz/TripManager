import { Entity, PrimaryKey, Property, ManyToMany, Collection, Unique } from '@mikro-orm/core';
import { Destination, DestinationDTO } from './exportHelp';
import { v4 } from 'uuid';

@Entity()
export class Trip {
    @PrimaryKey()
    id: string = v4();

    @Unique()
    @Property()
    name!: string;

    @Property()
    description!: string;

    @Property()
    image!: string;

    @Property()
    participants!: string;

    @Property()
    start_date!: Date;

    @Property()
    end_date!: Date;

    @ManyToMany(() => Destination)
    destinations = new Collection<Destination>(this);

    constructor({ name, description, image, participants, start_date, end_date }: TripDTO){
        this.name = name;
        this.description = description;
        this.image = image;
        this.participants = participants;
        this.start_date = start_date;
        this.end_date = end_date;
    }
}

export type TripDTO = {
    name: string;
    description: string;
    image: string;
    participants: string;
    start_date: Date;
    end_date: Date;
};