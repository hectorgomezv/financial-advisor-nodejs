/* eslint-disable import/no-unresolved, no-console */

import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '300s',
};

export default function run() {
  http.get('http://localhost/api/v1/health');
  sleep(1);
}
