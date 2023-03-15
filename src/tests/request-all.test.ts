import { requestWithXhr } from '../requestWithXhr';
import { requestWithWx } from '../requestWithWx';
import { requestWithMy } from '../requestWithMy';
import { requestWithSwan } from '../requestWithSwan';

import './libs/mock-xhr';
import './libs/mock-wx';
import './libs/mock-my';
import './libs/mock-swan';

describe('all libs tests', () => {
  for (const [name, request] of [
    ['xhr', requestWithXhr],
    ['wx', requestWithWx],
    ['my', requestWithMy],
    ['swan', requestWithSwan],
  ] as const) {
    test(`[${name}] basic`, async () => {
      const res = await request({
        method: 'GET',
        url: '/test',
        headers: { a: '1', b: '2' },
        timeout: 100,
      });
      expect(res).toMatchObject({
        data: {
          method: 'GET',
          url: '/test',
          headers: { a: '1', b: '2' },
          timeout: 100,
        },
        headers: { server: 'mock' },
        statusCode: 200,
      });
    });

    test(`[${name}] post`, async () => {
      const res = await request({
        method: 'POST',
        url: '/test',
        data: { a: '1', b: '2' },
      });
      expect(res).toMatchObject({
        data: {
          method: 'POST',
          url: '/test',
          data: { a: '1', b: '2' },
        },
        headers: { server: 'mock' },
        statusCode: 200,
      });
    });

    test(`[${name}] files`, async () => {
      const f1 = new Blob(['abc'], { type: 'text/plain' });
      const res = await request({
        method: 'POST',
        url: '/test',
        data: { a: '1', b: '2' },
        files: { f1 },
      });
      expect(res).toMatchObject({
        data: {
          method: 'POST',
          url: '/test',
          data: { a: '1', b: '2' },
          files: { f1: 'data:text/plain;base64,YWJj' },
        },
        headers: { server: 'mock' },
        statusCode: 200,
      });
    });

    test(`[${name}] 500`, async () => {
      const res = await request({
        method: 'GET',
        url: '/test',
        headers: {
          'status-code': '500',
        },
      });
      expect(res).toMatchObject({
        data: {
          method: 'GET',
          url: '/test',
        },
        headers: { server: 'mock' },
        statusCode: 500,
      });
    });
  }
});
