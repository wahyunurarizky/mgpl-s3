import axios from 'axios';

export const createTeam = async (data) => {
  try {
    const url = '/api/v1/teams';

    const res = await axios({
      method: 'post',
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

export const deleteTeam = async (id) => {
  try {
    const url = `/api/v1/teams/${id}`;

    await axios({
      method: 'delete',
      url,
    });
    await axios({
      method: 'delete',
      url: `/api/v1/teams/${id}/players`,
    });

    alert('successfull');
    location.reload();
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const fillForm = async (id) => {
  try {
    const url = `/api/v1/teams/${id}`;

    const resGet = await axios({
      method: 'get',
      url,
    });

    const team = resGet.data.data.doc;

    document.getElementById('teamId').value = team._id;
    document.getElementById('nameU').value = team.name;
    document.getElementById('shortNameU').value = team.shortName;
    document.getElementById('achievementU').value = team.achievement;
    document.getElementById('descriptionU').value = team.description;
    document
      .querySelector('.img-logo')
      .setAttribute('src', `/img/teams/${team.logo}`);
    // document.getElementById('logoU').value = team.logo;
  } catch (err) {
    alert(err);
  }
};

export const updateTeam = async (data, teamId) => {
  teamId;
  try {
    const url = `/api/v1/teams/${teamId}`;

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
