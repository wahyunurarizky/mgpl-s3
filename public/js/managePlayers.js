import axios from 'axios';

export const createPlayer = async (data) => {
  try {
    const param = window.location.href.split('/');
    const teamId = param[param.length - 1];

    const url = `/api/v1/teams/${teamId}/players`;
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
    alert(err);
  }
};

export const deletePlayer = async (id) => {
  try {
    const param = window.location.href.split('/');
    const teamId = param[param.length - 1];
    const url = `/api/v1/teams/${teamId}/players/${id}`;

    const res = await axios({
      method: 'delete',
      url,
    });

    alert('successfull');
    location.reload();
  } catch (err) {
    alert(err.response.data.message);
  }
};
