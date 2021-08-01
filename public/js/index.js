import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import '@babel/polyfill';
import 'bootstrap';
import { login, logout } from './login';
import { createTeam, deleteTeam, updateTeam, fillForm } from './manageTeam';
import { createPlayer, deletePlayer } from './managePlayers';
import { addResult, updateResult } from './manageResults';
import { detailPlayer } from './detailPlayer';
import { resultDetail } from './resultDetail';
import { createStreamer, deleteStreamer } from './manageStreamer';
import { createNews, deleteNews } from './manageNews';

const loginForm = document.querySelector('.form-login');
const formAddTeam = document.querySelector('.form--addTeam');
const formUpdateTeam = document.querySelector('.form--updateTeam');
const editButton = document.querySelectorAll('.edit-team');
const deleteButton = document.querySelectorAll('.delete-team');
const formAddPlayer = document.querySelector('.form--addPlayer');
const deletePlayerButton = document.querySelectorAll('.delete-player');
const addResultButton = document.querySelectorAll('.button-add-result');
const formUpdateResult = document.querySelector('.form--addResult');
const buttonDetailPlayer = document.querySelectorAll('.btn-detail-player');
const buttonResultDetail = document.querySelectorAll('.btn-result-detail');
const formAddStreamer = document.querySelector('.form--addStreamer');
const deleteStreamerButton = document.querySelectorAll('.delete-streamer');
const formAddNews = document.querySelector('.form--addNews');
const deleteNewsButton = document.querySelectorAll('.delete-news');
const btnLogout = document.querySelector('.btn-logout');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (formAddTeam) {
  formAddTeam.addEventListener('submit', (e) => {
    e.preventDefault();
    // sama aja buat multipar/form-data
    const form = new FormData();
    // const name = document.getElementById('name').value;
    // const shortName = document.getElementById('shortName').value;

    form.append('name', document.getElementById('name').value);
    form.append('shortName', document.getElementById('shortName').value);
    form.append('achievement', document.getElementById('achievement').value);
    form.append('description', document.getElementById('description').value);
    form.append('logo', document.getElementById('logo').files[0]);
    // console.log(document.getElementById('logo').files[0]);
    createTeam(form);
  });
}
if (formUpdateTeam) {
  formUpdateTeam.addEventListener('submit', (e) => {
    e.preventDefault();
    // sama aja buat multipar/form-data
    const formU = new FormData();
    // const name = document.getElementById('name').value;
    // const shortName = document.getElementById('shortName').value;

    formU.append('name', document.getElementById('nameU').value);
    formU.append('shortName', document.getElementById('shortNameU').value);
    formU.append('achievement', document.getElementById('achievementU').value);
    formU.append('description', document.getElementById('descriptionU').value);
    formU.append('logo', document.getElementById('logoU').files[0]);
    // console.log(document.getElementById('logo').files[0]);
    updateTeam(formU, document.getElementById('teamId').value);
  });
}

if (deleteButton) {
  deleteButton.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      deleteTeam(button.dataset['id']);
    });
  });
}
if (editButton) {
  editButton.forEach((button) => {
    // console.log(button);
    button.addEventListener('click', (e) => {
      e.preventDefault();
      fillForm(button.dataset['id']);
    });
  });
}

if (addResultButton) {
  addResultButton.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      addResult(button.dataset['id']);
    });
  });
}

if (formAddPlayer) {
  formAddPlayer.addEventListener('submit', (e) => {
    e.preventDefault();
    // sama aja buat multipar/form-data
    const form = new FormData();
    // const name = document.getElementById('name').value;
    // const shortName = document.getElementById('shortName').value;

    form.append('nick', document.getElementById('nick').value);
    form.append('idGame', document.getElementById('idGame').value);
    form.append('name', document.getElementById('name').value);
    form.append('instagram', document.getElementById('instagram').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(document.getElementById('logo').files[0]);
    createPlayer(form);
  });
}

if (deletePlayerButton) {
  deletePlayerButton.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      deletePlayer(button.dataset['id']);
    });
  });
}

if (formUpdateResult) {
  formUpdateResult.addEventListener('submit', (e) => {
    e.preventDefault();
    // sama aja buat multipar/form-data

    let winner = '';
    let loser = '';
    if (
      document.getElementById('winner').value ==
      document.getElementById('team1').value
    ) {
      winner = document.getElementById('team1').value;
      loser = document.getElementById('team2').value;
    } else {
      winner = document.getElementById('team2').value;
      loser = document.getElementById('team1').value;
    }
    const mvp = [
      document.getElementById('mvp1').value,
      document.getElementById('mvp2').value,
    ];

    const formR = new FormData();
    // const name = document.getElementById('name').value;
    // const shortName = document.getElementById('shortName').value;

    formR.append('win', winner);
    formR.append('lose', loser);
    formR.append('score', document.getElementById('score').value);
    formR.append(
      'poinTimWin',
      document.getElementById('totalWinTimMenang').value
    );
    formR.append(
      'poinTimLose',
      document.getElementById('totalWinTimKalah').value
    );
    formR.append('mvp[]', mvp[0]);
    formR.append('mvp[]', mvp[1]);
    // formR.append(
    //   'screenshoots',
    //   document.getElementById('screenshoots').files[0]
    // );
    // formR.append(
    //   'screenshoots',
    //   document.getElementById('screenshoots').files[1]
    // );
    // formR.append(
    //   'screenshoots[]',
    //   document.getElementById('screenshoots').files[1]
    // );
    formR.append('finish', true);
    // console.log(document.getElementById('nameU').value);
    // console.log(document.getElementById('logo').files[0]);
    updateResult(formR, document.getElementById('resultId').value);
  });
}

if (buttonDetailPlayer) {
  buttonDetailPlayer.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      detailPlayer(button.dataset['id']);
    });
  });
}
if (buttonResultDetail) {
  buttonResultDetail.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      resultDetail(button.dataset['id']);
    });
  });
}

if (formAddStreamer) {
  formAddStreamer.addEventListener('submit', (e) => {
    e.preventDefault();
    // sama aja buat multipar/form-data
    const form = new FormData();
    // const name = document.getElementById('name').value;
    // const shortName = document.getElementById('shortName').value;

    form.append('photo', document.getElementById('photo').files[0]);
    createStreamer(form);
  });
}
if (deleteStreamerButton) {
  deleteStreamerButton.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      deleteStreamer(button.dataset['id']);
    });
  });
}
if (formAddNews) {
  formAddNews.addEventListener('submit', (e) => {
    e.preventDefault();
    // sama aja buat multipar/form-data
    const form = new FormData();
    // const name = document.getElementById('name').value;
    // const shortName = document.getElementById('shortName').value;

    form.append('photo', document.getElementById('photo').files[0]);
    createNews(form);
  });
}
if (deleteNewsButton) {
  deleteNewsButton.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      deleteNews(button.dataset['id']);
    });
  });
}

if (btnLogout) {
  btnLogout.addEventListener('click', logout);
}
