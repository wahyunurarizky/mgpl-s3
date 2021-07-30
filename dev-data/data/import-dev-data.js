const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Team = require('../../models/teamModel');

dotenv.config({ path: './config.env' });

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
    console.log('db connection successfull');
  });

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/teams.json`, 'utf-8'));

const importData = async () => {
  try {
    await Team.create(tours);
    console.log('data successfully loaded');
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Team.deleteMany();
    console.log('data successfully deleted');
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
