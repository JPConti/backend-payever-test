import axios from 'axios';

export async function listUsers(user: string) {
  const options = {
    method: 'GET',
    url: 'https://reqres.in/api/users/',
    params: { user: user },
  };
  return axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}

export async function listAvatar(avatar: string) {
  const options = {
    method: 'GET',
    url: 'https://reqres.in/api/users',
    params: { avatar: avatar },
  };
  return axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}
