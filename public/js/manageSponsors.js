import axios from 'axios';

export const createSponsor = async (data) => {
  try {
    const url = '/api/v1/sponsor';

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

export const deleteSponsor = async (id) => {
  try {
    const url = `/api/v1/sponsor/${id}`;

    await axios({
      method: 'delete',
      url,
    });

    alert('successfull');
    location.reload();
  } catch (err) {
    alert(err.response.data.message);
  }
};
