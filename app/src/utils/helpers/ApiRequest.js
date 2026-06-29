import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {logoutSuccess, storeRoletype} from '../../redux/reducer/AuthReducer';
import {Store} from '../../redux/Store';
import constants from './constants';
import {normalizeApiError} from './errorHelper';

// Shared helper — clears token + forces logout on invalid/expired token
const handleUnauthorized = async () => {
  try {
    await AsyncStorage.removeItem(constants.TRUSTWORKTKN);
  } finally {
    Store.dispatch(logoutSuccess(null));
    Store.dispatch(storeRoletype(''));
  }
};

// Intercept every axios response — on 401 (invalid/expired token) force logout
axios.interceptors.response.use(
  response => response,
  async error => {
    const normalizedError = normalizeApiError(error);

    if (normalizedError?.status === 401) {
      await handleUnauthorized();
    }
    return Promise.reject(normalizedError);
  },
);

const buildHeaders = (header, payload) => {
  // Preserve all original headers
  const headers = {...header};

  // Normalize Authorization
  const authKey = Object.keys(headers).find(
    k => k.toLowerCase() === 'authorization',
  );
  if (authKey) {
    let authValue = headers[authKey];
    if (authValue && typeof authValue === 'string' && !authValue.includes(' ')) {
      authValue = `Token ${authValue}`;
    }
    headers['Authorization'] = authValue;
    if (authKey !== 'Authorization') {
      delete headers[authKey];
    }
  }

  // Normalize Content-Type
  const contentKey = Object.keys(headers).find(
    k => k.toLowerCase() === 'contenttype' || k.toLowerCase() === 'content-type',
  );
  let contentType = contentKey ? headers[contentKey] : 'application/json';

  const isFormData = payload && typeof payload.append === 'function';

  if (isFormData) {
    contentType = undefined;
    if (contentKey) {
      delete headers[contentKey];
    }
    delete headers['Content-Type'];
  } else {
    headers['Content-Type'] = contentType;
    if (contentKey && contentKey !== 'Content-Type') {
      delete headers[contentKey];
    }
  }

  return {headers, isFormData};
};

/**
 * Sends a multipart/form-data request using the global fetch API.
 * This correctly handles iOS security-scoped file URIs returned by
 * document/image pickers, which ReactNativeBlobUtil.wrap() cannot access.
 */
const sendMultipartWithFetch = async (method, url, payload, headers) => {
  const formData = new FormData();
  payload._parts.forEach(([name, value]) => {
    if (value && typeof value === 'object' && value.uri) {
      formData.append(name, {
        uri: value.uri,
        name: value.name || 'file',
        type: value.type || 'application/octet-stream',
      });
    } else {
      formData.append(name, String(value));
    }
  });

  // Remove Content-Type so fetch sets it automatically with the correct boundary
  const fetchHeaders = {...headers};
  delete fetchHeaders['Content-Type'];
  delete fetchHeaders['content-type'];

  const response = await fetch(url, {
    method,
    headers: fetchHeaders,
    body: formData,
  });

  if (response.status === 401) {
    await handleUnauthorized();
  }

  return await handleFetchResponse(response);
};

const handleFetchResponse = async response => {
  let data = null;
  const contentType = response.headers.get('content-type');
  const responseText = await response.text();

  if (responseText) {
    if (contentType && contentType.includes('application/json')) {
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        data = {message: responseText};
      }
    } else {
      data = {message: responseText};
    }
  }

  return {
    status: response.status,
    data: data || {},
  };
};

export async function getApi(url, header) {
  const finalUrl = url.startsWith('http') ? url : `${constants.BASE_URL}/${url}`;
  const {headers} = buildHeaders(header);

  try {
    return await axios.get(finalUrl, {
      headers: headers,
    });
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function postApi(url, payload, header) {
  const finalUrl = url.startsWith('http') ? url : `${constants.BASE_URL}/${url}`;
  const {headers, isFormData} = buildHeaders(header, payload);

  try {
    if (isFormData) {
      return await sendMultipartWithFetch('POST', finalUrl, payload, headers);
    }

    return await axios.post(finalUrl, payload, {headers});
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function putApi(url, payload, header) {
  const finalUrl = url.startsWith('http') ? url : `${constants.BASE_URL}/${url}`;
  const {headers, isFormData} = buildHeaders(header, payload);

  try {
    if (isFormData) {
      return await sendMultipartWithFetch('PUT', finalUrl, payload, headers);
    }

    return await axios.put(finalUrl, payload, {headers});
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function patchApi(url, payload, header) {
  const finalUrl = url.startsWith('http') ? url : `${constants.BASE_URL}/${url}`;
  const {headers, isFormData} = buildHeaders(header, payload);

  try {
    if (isFormData) {
      return await sendMultipartWithFetch('PATCH', finalUrl, payload, headers);
    }

    return await axios.patch(finalUrl, payload, {headers});
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function deleteApi(url, header) {
  const finalUrl = url.startsWith('http') ? url : `${constants.BASE_URL}/${url}`;
  const {headers} = buildHeaders(header);

  try {
    return await axios.delete(finalUrl, {
      headers: headers,
    });
  } catch (error) {
    throw normalizeApiError(error);
  }
}
