import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fintrack',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_insecure_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    resetExpiresIn: process.env.JWT_RESET_EXPIRES_IN || '30m',
  },
  upload: {
    dir: path.resolve(__dirname, '..', process.env.UPLOAD_DIR || 'uploads'),
    maxBytes: (Number(process.env.MAX_UPLOAD_MB) || 2) * 1024 * 1024,
  },
  email: {
    from: process.env.EMAIL_FROM || 'FinTrack <no-reply@fintrack.app>',
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};
