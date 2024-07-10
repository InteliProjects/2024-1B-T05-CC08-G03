import http from 'k6/http';
import { sleep } from 'k6';

const body = open('test.txt')

export const options = {
  vus: 10,
  duration: '30s',
};

export default function() {
  http.post('http://localhost:3000/api/lexico', body, { headers: { 'Content-Type': 'text/plain' } });
  sleep(1);
}
