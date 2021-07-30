import axios from 'axios';

export const resultDetail = async (id) => {
  const res = await axios({
    method: 'get',
    url: `/api/v1/schedules/${id}`,
  });
  const sch = res.data.data.doc;
  let ss = ``;
  sch.screenshoots.forEach((e) => {
    ss += `<img class="mb-2" src="/img/ss/${e}" width="300" alt="" />`;
  });
  document.getElementById('ss').innerHTML = ss;
  let mvp = ``;
  sch.mvp.forEach((e) => {
    mvp += `${e.nick} <br>`;
  });
  document.getElementById('mvp').innerHTML = mvp;
  document.getElementById(
    'poin'
  ).innerHTML = `${sch.poinTimWin} - ${sch.poinTimLose}`;
};
