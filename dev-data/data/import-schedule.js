const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Team = require('../../models/teamModel');
const Schedule = require('../../models/scheduleModels');
const Player = require('../../models/playerModel');

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

const importData = async () => {
  try {
    const teams = await Team.find();

    // const teamLength = teams.length;

    // await Schedule.create({ sesi: 1, t1: teams[0].id, t2: teams[0].id });
    // await Schedule.create({ sesi: 2, t1: teams[1].id, t2: teams[2].id });
    // teams.forEach(async (e, i) => {
    // console.log(i);
    // await Schedule.create({ sesi: i, t1: teams[0].id, t2: teams[1 + i].id });
    // await Schedule.create({
    //   sesi: i,
    //   t1: teams[3 + i].id,
    //   t2: teams[2 + i].id,
    // });

    // });
    const start = new Date('2021-04-13T20:00:00').getTime();
    console.log(start);
    let sesi = 'A';
    let day = 1;
    let startDate = start;
    for (let i = 1; i < teams.length; i++) {
      if (new Date(startDate).getDay() == 6) startDate += 86400000 * 2;
      console.log(startDate);

      await Schedule.create({
        day,
        sesi,
        t1: teams[0].id,
        t2: teams[i].id,
        startDate,
        divisi: 'satu',
      });
      for (let j = 1; j < teams.length / 2; j++) {
        let a = teams.length - j - 1 + i;
        let b = i + j;

        if (a > teams.length - 1) a -= teams.length - 1;
        if (b > teams.length - 1) b -= teams.length - 1;

        console.log(a, b);
        await Schedule.create({
          day,
          sesi,
          t1: teams[a].id,
          t2: teams[b].id,
          startDate,
          divisi: 'satu',
        });
      }
      if (i % 2 != 0) {
        if (i == 1) {
          startDate += 86400000;
        } else {
          startDate += 79200000;
        }
        day++;
        sesi = 'A';
      } else {
        startDate += 7200000;
        sesi = 'B';
      }
    }

    // await Schedule.create();
    // console.log(teams);
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Schedule.deleteMany();
    console.log('data successfully deleted');
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

const addDivisi = async () => {
  try {
    await Team.deleteMany();
    await Player.deleteMany();
  } catch (e) {
    console.log(e);
  }
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
if (process.argv[2] === '--test') {
  addDivisi();
}
