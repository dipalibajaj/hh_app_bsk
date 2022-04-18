import mongoose from 'mongoose';
import { UserRepository } from './user/user.repository';

async function connect(connect: boolean = true): Promise<void> {
  if (connect) {
    console.info('🍀 Connecting to Database...');
    try {
      await mongoose.connect(process.env.DB_URI!!);
    } catch (error) {
      console.info(`🍀 Could not connect to database! Is it running?`);
      throw error;
    }
  } else {
    console.info('🍀 Closing Connections with Database...');
    mongoose.connections.forEach(
      async connection => await connection.close(true),
    );
    console.info('🍀 Connections closed...');
  }
};

export default {
  connect,
  userRepository: new UserRepository(),
}