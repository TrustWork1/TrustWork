const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'
const baseUrlMedia = process.env.NEXT_PUBLIC_IMAGE_BASE_URL

export const mediaUrl = (url: string) => {
  return `${baseUrlMedia}/${url}`
  // return `${baseUrlMedia}/media/${url}`
}

export default {
  serviceProviderJobTypeList: `${BASE_URL}/category/`,
  locationAllList: `${BASE_URL}/location/list/`,
  jobCategoriesAllList: `${BASE_URL}/category/`,
  clientAllList: `${BASE_URL}/admin/client/profile`,
  providerAllList: `${BASE_URL}/admin/provider/profile`
}
