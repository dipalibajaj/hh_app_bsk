import expressLoader from './express';
import express from 'express';
import services from './services';
//import socketLoader from './socket';
import redis from './redis';
import db from 'hohealth-db-node/dist';

export default async ({
  expressApp,
  isStarting = true,
}: {
  expressApp?: express.Application;
  isStarting?: boolean;
}) => {
  //connect/disconnect to database
  await db.connect(isStarting);
  //connect/disconnect to redis
  await redis(isStarting);
  //load/unload express
  expressLoader({ app: expressApp!!, isStarting: isStarting });
  //load/unload services
  await services(isStarting);
};
