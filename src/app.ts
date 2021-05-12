import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get(
  "/healthz",
  async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      message: "I am alive"
    });
  }
);

export default app;