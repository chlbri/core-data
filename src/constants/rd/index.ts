import CLIENT_ERRORS from './client';
import INFORMATIONS from './information';
import PERMISSION_DENIEDS from './permission';
import REDIRECTS from './redirect';
import SERVER_ERRORS from './server';
import SUCCESS from './success';
import TIMEOUT_ERRORS from './timeout';

export const RETURN_DATAS = {
  ...CLIENT_ERRORS,
  ...INFORMATIONS,
  ...PERMISSION_DENIEDS,
  ...REDIRECTS,
  ...SERVER_ERRORS,
  ...SUCCESS,
  ...TIMEOUT_ERRORS,
};

export {
  CLIENT_ERRORS,
  INFORMATIONS,
  PERMISSION_DENIEDS,
  REDIRECTS,
  SERVER_ERRORS,
  SUCCESS,
  TIMEOUT_ERRORS,
};
