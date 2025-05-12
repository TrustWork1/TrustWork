const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  loginEndpoint: `${BASE_URL}/admin/login/`,
  registerEndpoint: `${BASE_URL}/admin/register/`,
  forgotPasswordEndpoint: `${BASE_URL}/admin/forgot-password/`,
  resetPasswordEndpoint: `${BASE_URL}/admin/reset-password/`,


  details: `${BASE_URL}/profile/details/admin/`,
  // details: `${BASE_URL}/profile/details`,
  update: `${BASE_URL}/profile/edit`,
  changePassword: `${BASE_URL}/profile/change_password`,
  logout: `${BASE_URL}/logout`,


  rememberMe: 'rememberMe',
  sessionData: 'userData',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
