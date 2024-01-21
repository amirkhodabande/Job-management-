require('dotenv').config();
require('express-async-errors');
const express = require('express');

// db
const connectDB = require('./db/connect');

//routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// middlewares
const authenticationMiddleware = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const app = express();

app.use(rateLimiter({
  windowsMs: 15 * 60 * 1000, // 15m
  max: 100
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticationMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
