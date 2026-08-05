import express from 'express';
import trackRouter from './routes/track';
import adminRouter from './routes/admin';

const app = express();
app.use(express.json());

app.use('/api/track', trackRouter);
app.use('/api/admin', adminRouter);

export default app;
