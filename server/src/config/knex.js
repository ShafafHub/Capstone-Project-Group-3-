import knex from 'knex';
import config from '../../../database/knexfile.js';

export const db = knex(config.development);