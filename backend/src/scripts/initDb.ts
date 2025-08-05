import dotenv from 'dotenv';
import { initializeDatabase } from '../config/database';

// Load environment variables
dotenv.config();

// Initialize database tables
const runInitialization = async () => {
  try {
    await initializeDatabase();
    console.log('✅ Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

runInitialization();
