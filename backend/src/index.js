import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Olá, PetPoints!');
});

app.listen(PORT, () => {
  console.log(`Server iniciado na porta: ${PORT}`);
});