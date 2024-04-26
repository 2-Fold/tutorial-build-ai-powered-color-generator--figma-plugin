import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors(), express.json());

app.post('/', (req, res) => {
  openai.chat.completions
    .create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You will be provided with a description and your task is to pick colour names and values that match the description. Write your output in a json array with objects containing name and value keys. Needs to be valid JSON all keys and values should be wrapped in quotations. Do not include any delimiters. If no number of colours is specified, create 5 values.',
        },
        {
          role: 'user',
          content: req.body.payload,
        },
      ],
      response_format: 'json' as
        | OpenAI.Chat.Completions.ChatCompletionCreateParams.ResponseFormat
        | undefined,
      max_tokens: 256,
      temperature: 1,
    })
    .then((response) => res.json(response))
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
