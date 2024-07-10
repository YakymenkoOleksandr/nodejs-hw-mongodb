import pino from 'pino-http';
import cors from 'cors';
import { getAllContacts, getContactsById } from './services/contacts.js';
import { env } from './utils/env.js';
import express from 'express';
const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 'success',
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch contacts',
        error: error.message,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { studentId } = req.params;
      const student = await getContactsById(studentId);

      if (!student) {
        return res.status(404).json({
          message: 'Student not found',
        });
      }

      res.status(200).json({
        data: student,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch student',
        error: error.message,
      });
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
  });
};
