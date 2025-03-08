import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { FactCheckController } from './controllers/factCheck';

dotenv.config();

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('Missing GOOGLE_API_KEY environment variable');
}

const factCheckController = new FactCheckController(apiKey);

app.post('/api/verify', (req, res) => factCheckController.verifyInformation(req, res));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});