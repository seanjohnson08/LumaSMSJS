// ================================================================================
// LumaSMS Backend REST API
// Written by - Hypernova
// MFGG - 2021
// ================================================================================

// NOTE: ALL POST / PUT / PATCH / DELETE REQUESTS (besides file uploads) MUST BE application/x-www-form-urlencoded!

// ==================== Core Components ====================
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { httpResultHandler } from 'lib/result.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 400
}));
app.use(httpResultHandler); // custom error handling

// ==================== Routes ====================
// - User -
import { userRouter } from './routes/user.js';
app.use('/user', userRouter);

// - Submission -
import { submissionRouter } from './routes/submission.js';
app.use('/submission', submissionRouter);

// ==================== Server ====================
let server = app.listen(12026, () => {
  const getAddress = server.address();
  let host = getAddress.address;
  let port = getAddress.port;
  console.log(`Application is running at "${host}:${port}".`);
});