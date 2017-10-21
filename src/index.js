import express, { Router } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Example from './models/Example';

dotenv.config();

// Connect to port defined in environment, otherwise, default to 8080
const port = process.env.PORT || 8080;

const dbUser = process.env.DB_USER || 'user';
const dbPass = process.env.DB_PASS || 'password';
const dbURI = process.env.DB_URI || 'localhost';
const dbName = process.env.DB_NAME || '2dv514';
const origin = process.env.HOST_ADDRESS || 'localhost';

// Create server
const app = express();

// Seed the database. Checks if an example document already exists, if not,
// it creates it in the database. Runs after the database is connected.
const seed = () => {
  Example.findOne({}, (err, example) => {
    if (err) {
      console.log(`Error seeding database: ${err}`);
    } else if (!example) {
      Example.create({ servicename: 'serviceA', message: 'Service A says hello!' }, (exampleErr, created) => {
        if (exampleErr) {
          console.log(`Error creating example document: ${exampleErr}`);
        } else {
          console.log(`Created example document: ${created}`);
        }
      });
    } else {
      console.log('Example document already created');
    }
  });
};

// Connect to the mongoDB instance running on the same machine.
const connect = () => {
  mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbURI}/${dbName}`, {
    useMongoClient: true,
  }, (err) => {
    if (err) {
      console.log(`Error connecting to database: ${err}`);
    } else {
      console.log('Connected to database');
      seed();
    }
  });
};

connect();

// Make sure that errors are reported and reconnect when disconnected.
mongoose.connection.on('error', console.error);
mongoose.connection.on('disconnected', connect);

// JSON body parser for API requests.
app.use(bodyParser.json());

const router = Router();

// The example route.
router.get('/hello', (req, res) => {
  Example.findOne({}, (err, example) => {
    if (err) return res.status(500).json({ servicename: null, message: err });
    if (!example) return res.status(404).json({ servicename: null, message: 'Not found' });

    const { servicename, message } = example;

    return res.status(200)
      .json({ servicename, message, origin });
  });
});

app.use(router);

// Standard 404 message when route not found.
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Start the server!
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
