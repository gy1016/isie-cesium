import request from '@/utils/server';

export function authLogin(data: any) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  });
}

export function verify() {
  return request({
    url: '/auth/verify',
    method: 'get',
  });
}

export function login(data: any) {
  return request({
    url: '/users/login',
    method: 'post',
    data,
  });
}

export function register(data: any) {
  return request({
    url: '/users/register',
    method: 'post',
    data,
  });
}
