import { USER_API } from '@/components/utils/constant';
import axios from 'axios';

const instance = axios.create({
  baseURL: USER_API, // Your API base URL
  withCredentials: true, // Ensures cookies are sent with requests
});

export default instance;
