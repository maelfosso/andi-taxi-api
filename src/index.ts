import mongoose, { mongo } from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 3000;
const { MONGODB_URI, MONGODB_DBNAME } = process.env;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined');
}

if (!process.env.MONGODB_DBNAME) {
  throw new Error('MONGODB_DBNAME must be defined!');
}

const start = () => {
  mongoose.set('toJSON', { virtuals: true });
  mongoose.set('debug', true);

  const mongoDBUrl = `${MONGODB_URI}/${MONGODB_DBNAME}`;
  mongoose.connect(mongoDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }, (err) => {
    if (err) {
      throw new Error(`Error connecting to ${mongoDBUrl} : ${err}`);
    }

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    })
  })
}

start();
