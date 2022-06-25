/* eslint-disable import/no-unresolved, no-console, no-undef */

import http from 'k6/http';
import { check } from 'k6';

const { EMAIL, PASSWORD } = __ENV;
const baseUrl = 'http://localhost:5100/api/v1';
const authBaseUrl = 'http://localhost:4200/api/v1';

export const options = {
  vus: 400,
  duration: '60s',
};

export function setup() {
  const loginUrl = `${authBaseUrl}/auth/accounts/login`;

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
}

export default function run(accessToken) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const res = http.get(`${baseUrl}/companies`, params);

  check(res, {
    'is status 200': r => r.status === 200,
  });
}
