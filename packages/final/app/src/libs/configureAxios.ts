import axios from 'axios';

const configureAxios = () => {
  axios.defaults.baseURL = 'http://localhost:3001';
};

export default configureAxios;
