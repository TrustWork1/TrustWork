const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/timesheet/list`,
  details: `${BASE_URL}/admin/timesheet/details`,
  store: `${BASE_URL}/admin/timesheet/add`,
  update: `${BASE_URL}/admin/timesheet/edit`,
  delete: `${BASE_URL}/admin/timesheet/delete`,
  updateStatus: `${BASE_URL}/admin/timesheet/status/change`
}
