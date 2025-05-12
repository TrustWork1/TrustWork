import axios from 'axios';
import constants from './constants';

const buildHeaders = header => ({
  Accept: header.Accept,
  'Content-Type': header.contenttype,
  ...(header.authorization && {Authorization: `Token ${header.authorization}`}),
  // 'x-access-token': header.authorization,  // Uncomment if needed
});

export async function getApi(url, header) {
  console.log('GetApi::::::::::: ', `${constants.BASE_URL}/${url}`, header);

  return await axios.get(`${constants.BASE_URL}/${url}`, {
    headers: buildHeaders(header),
  });
}

export async function postApi(url, payload, header) {
  console.log(
    'PostApi:::::::::::: ',
    `${constants.BASE_URL}/${url}`,
    payload,
    header,
  );

  return await axios.post(`${constants.BASE_URL}/${url}`, payload, {
    headers: buildHeaders(header),
  });
}

export async function putApi(url, payload, header) {
  console.log(
    'PutApi:::::::::::: ',
    `${constants.BASE_URL}/${url}`,
    payload,
    header,
  );

  return await axios.put(`${constants.BASE_URL}/${url}`, payload, {
    headers: buildHeaders(header),
  });
}

export async function patchApi(url, payload, header) {
  console.log(
    'PatchApi:::::::::::: ',
    `${constants.BASE_URL}/${url}`,
    payload,
    header,
  );

  return await axios.patch(`${constants.BASE_URL}/${url}`, payload, {
    headers: buildHeaders(header),
  });
}

export async function deleteApi(url, header) {
  console.log('DeleteApi:::::::::::: ', `${constants.BASE_URL}/${url}`, header);

  return await axios.delete(`${constants.BASE_URL}/${url}`, {
    headers: buildHeaders(header),
  });
}
