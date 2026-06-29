const FALLBACK_MESSAGE =
  'Something went wrong. Please check your network connection.';

const firstString = value => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(firstString).find(Boolean) || '';
  }

  if (typeof value === 'object') {
    return Object.values(value).map(firstString).find(Boolean) || '';
  }

  return String(value);
};

export const getErrorDetails = error => {
  const responseData = error?.response?.data || error?.data || {};
  const status = error?.response?.status || error?.status || null;
  const message =
    firstString(responseData?.message) ||
    firstString(responseData?.data?.message) ||
    firstString(responseData?.data?.error) ||
    firstString(responseData?.data?.detail) ||
    firstString(responseData?.detail) ||
    firstString(responseData?.error) ||
    firstString(error?.message) ||
    FALLBACK_MESSAGE;

  return {status, message};
};

export const normalizeApiError = error => {
  const {status, message} = getErrorDetails(error);
  const canReuseError =
    error && (typeof error === 'object' || typeof error === 'function');
  const normalizedError = canReuseError ? error : new Error(message);

  normalizedError.status = status;
  normalizedError.message = message;

  return normalizedError;
};
