import express from 'express';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import { Trip } from './entities/Trip';
import { Destination } from './entities/Destination';
import http from "http";
import { tripRouter } from './controller/Trip.controller';
import { destinationRouter } from './controller/Destination.controller';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = parseInt(process.env.PORT || '3000', 10);
app.use(express.json()); // for parsing application/json

export const DI = {} as {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    tripRepository: EntityRepository<Trip>;
    destinationRepository: EntityRepository<Destination>;
};



const initializeServer = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    const em = orm.em;

    DI.orm = orm;
    DI.em = em;
    DI.tripRepository = em.getRepository(Trip);
    DI.destinationRepository = em.getRepository(Destination);

    app.use('/trips', tripRouter);
    app.use('/destinations', destinationRouter);


    app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
    });
};

initializeServer().catch((err) => {
    console.error(err);
});