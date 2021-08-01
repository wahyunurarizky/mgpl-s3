import axios from 'axios';

export const createStreamer = async (data) => {
  try {
    const url = '/api/v1/streamer';

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

export const deleteStreamer = async (id) => {
  try {
    const url = `/api/v1/streamer/${id}`;

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
