const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('uncaugt Exception ... shutting down');

  process.exit(1); //0 artinya sukes, 1 artinya crash
});

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('db connection successfully');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});

// misal salah password db
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION ... shutting down');

  // server finish the request pending at the time
  server.close(() => {
    // immmediatly abort proces s pending and running
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('sigterm received shut donw');
  server.close(() => {
    console.log('processsssss terminated');
  });
});
