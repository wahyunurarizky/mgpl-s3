import axios from 'axios';

export const addResult = async (id) => {
  try {
    const url = `/api/v1/schedules/${id}`;

    const resSch = await axios({
      method: 'get',
      url,
    });

    const schedule = resSch.data.data.doc;
    document.getElementById('resultId').value = schedule._id;
    document.getElementById('team1').value = schedule.t1.id;
    document.getElementById('team2').value = schedule.t2.id;
    const resTeam1 = await axios({
      method: 'get',
      url: `/api/v1/teams/${schedule.t1.id}`,
    });
    const resTeam2 = await axios({
      method: 'get',
      url: `/api/v1/teams/${schedule.t2.id}`,
    });
    const playerT1 = resTeam1.data.data.doc.players;
    const playerT2 = resTeam2.data.data.doc.players;

    document.getElementById('winner').innerHTML = '';
    document.getElementById('winner').appendChild(new Option('select winner'));
    document
      .getElementById('winner')
      .appendChild(new Option(schedule.t1.shortName, schedule.t1.id));
    document
      .getElementById('winner')
      .appendChild(new Option(schedule.t2.shortName, schedule.t2.id));

    document.getElementById('mvp1').innerHTML = '';
    document.getElementById('mvp2').innerHTML = '';
    document.getElementById('mvp1').appendChild(new Option('select mvp m1'));
    document.getElementById('mvp2').appendChild(new Option('select mvp m2'));

    playerT1.forEach((e) => {
      document.getElementById('mvp1').appendChild(new Option(e.nick, e._id));
    });
    playerT2.forEach((e) => {
      document.getElementById('mvp1').appendChild(new Option(e.nick, e._id));
    });

    playerT1.forEach((e) => {
      document.getElementById('mvp2').appendChild(new Option(e.nick, e._id));
    });
    playerT2.forEach((e) => {
      document.getElementById('mvp2').appendChild(new Option(e.nick, e._id));
    });
    // document.getElementById('logoU').value = team.logo;
  } catch (err) {
    alert(err);
  }
};

export const updateResult = async (data, resultId) => {
  try {
    const url = `/api/v1/schedules/${resultId}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      alert('successfull');
      location.reload();
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const changeDay = async (day, value) => {
  try {
    const url = `/api/v1/schedules/day/${day}`;
    const res = await axios({
      method: 'PATCH',
      url,
      data: {
        startDate: value,
      },
    });
    if (res.data.status === 'success') {
      alert('successfull');
      location.reload();
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};
