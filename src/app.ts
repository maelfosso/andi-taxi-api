import express, { Application, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { authRouter } from './routes/auth.route';
import { errorHandler } from './middlewares/error-handler';
import morgan from 'morgan';
import { NotFoundError } from './errors/not-found-error';
import { currentUser } from './middlewares/current-user';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combined'));

app.get(
  "/healthz",
  async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      message: "I am alive"
    });
  }
);

app.use(currentUser);

app.use(authRouter);
app.use(errorHandler);

app.all('*', async (req:Request, res:Response) => {
  console.log('Route Not Found');
  throw new NotFoundError();
})

export default app;