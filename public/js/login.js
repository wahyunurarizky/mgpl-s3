import axios from 'axios';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      alert('login successfully');
      window.setTimeout(() => {
        location.assign('/panel-admin');
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      alert('logout successfull');
      location.assign('/panel-admin/login');
    }
  } catch (err) {
    console.log(err);
    alert('error', 'Error logging out! try Again');
  }
};
