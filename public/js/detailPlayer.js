import axios from 'axios';
export const detailPlayer = async (id) => {
  const resp = await axios({
    method: 'get',
    url: `/api/v1/players/${id}`,
  });

  const player = resp.data.data.doc;
  document.getElementById('nick').innerHTML = player.nick;
  document.getElementById('name').innerHTML = player.name;
  document.getElementById('idGame').innerHTML = player.idGame;
  document.getElementById('instagram').innerHTML = player.instagram;
  document.getElementById('motto').innerHTML = player.motto;
  document.getElementById('mvp').innerHTML = `${player.mvp} kali`;
};
