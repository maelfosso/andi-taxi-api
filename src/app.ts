import express, { Application, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { authRouter } from './routes/auth.route';
import { errorHandler } from './middlewares/error-handler';

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

app.use(authRouter);
app.use(errorHandler);

export default app;