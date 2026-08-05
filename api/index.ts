import express from 'express';
import trackRouter from './routes/track.js';
import adminRouter from './routes/admin.js';

const app = express();
app.use(express.json());

app.use('/api/track', trackRouter);
app.use('/api/admin', adminRouter);

export default app;
