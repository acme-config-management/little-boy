import express, { Router } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Example from './models/Example';

const port = process.env.PORT || 8080;

const app = express();

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

const connect = () => {
  mongoose.connect('mongodb://localhost/2dv514', {
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

mongoose.connection.on('error', console.error);
mongoose.connection.on('disconnected', connect);

app.use(bodyParser.json());

const router = Router();

router.get('/hello', (req, res) => {
  Example.findOne({}, (err, example) => {
    if (err) return res.status(500).json({ servicename: null, message: err });
    if (!example) return res.status(404).json({ servicename: null, message: 'Not found' });

    const { servicename, message } = example;

    return res.status(200).json({ servicename, message });
  });
});

app.use(router);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
