import { Trip } from './entities/Trip';
import { Destination } from './entities/Destination';
import dotenv from 'dotenv';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';

dotenv.config();

export default defineConfig({
    entities: [Trip, Destination],
    clientUrl: process.env.DATABASE_URL,
    debug: false,
    driver: PostgreSqlDriver,
});