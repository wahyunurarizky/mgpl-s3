import axios from 'axios';

export const createNews = async (data) => {
  try {
    const url = '/api/v1/news';

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

export const deleteNews = async (id) => {
  try {
    const url = `/api/v1/news /${id}`;

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
