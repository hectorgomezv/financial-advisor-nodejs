/* eslint-disable import/no-unresolved, no-console, no-undef */

import http from 'k6/http';
import { sleep } from 'k6';

const { EMAIL, PASSWORD } = __ENV;
const baseUrl = 'http://localhost/api/v1';
let accessToken;

export const options = {
  vus: 20,
  duration: '300s',
};

const getAccessToken = () => {
  const loginUrl = `${baseUrl}/auth/accounts/login`;

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const payload = JSON.stringify({
    data: {
      email: EMAIL,
      password: PASSWORD,
    },
  });

  const { body } = http.post(loginUrl, payload, params);
  const bodyParsed = JSON.parse(body);

  return bodyParsed.data.accessToken;
};

export default function run() {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || getAccessToken()}`,
    },
  };

  const res = http.get(`${baseUrl}/companies`, params);
  console.log(JSON.stringify(res));
  sleep(0.2);
}