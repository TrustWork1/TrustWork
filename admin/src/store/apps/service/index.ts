import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from 'axios'

interface Service {
  id: number
  name: string
  description: string
}

interface DataParams {
  q: string

  // status: string
  // currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Services Thunk
export const fetchServices = createAsyncThunk<Service[], DataParams>(
  'appServices/fetchServices',
  async (params: DataParams) => {
    const response = await axios.get('/apps/services/list', { params })

    return response.data
  }
)

// ** Add Service Thunk
export const addService = createAsyncThunk(
  'appServices/addService',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post('/apps/services/add-service', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Refetch the services after adding a new one
    dispatch(fetchServices(getState().appServices.params))

    return response.data
  }
)

// ** Delete Service Thunk
export const deleteService = createAsyncThunk(
  'appServices/deleteService',
  async (id: number | string, { getState, dispatch }: Redux) => {
    try {
      const response = await axios.delete('/apps/services/delete', { data: id })
      dispatch(fetchServices(getState().appServices.params))
      
      return response.data
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

// export const deleteService = createAsyncThunk(
//   'appServices/deleteService',
//   async (id: number | string, { getState, dispatch }: Redux) => {
//     const response = await axios.delete(`/apps/services/delete`, { params: { id } });

//     // Refetch the services after deletion
//     dispatch(fetchServices(getState().appServices.params));

//     return response.data;
//   }
// );

// ** Redux Slice
// const appServicesSlice = createSlice({
//   name: 'appServices',
//   initialState: {
//     data: [] as Service[],
//     total: 0,
//     params: {} as DataParams,
//     allData: [] as Service[]
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder.addCase(fetchServices.fulfilled, (state, action) => {
//       state.data = action.payload;
//       state.total = action.payload.length;

//     })

//   }
// });

interface AppServicesState {
  data: Service[]
  total: number
  params: DataParams
  allData: Service[]
}

const initialState: AppServicesState = {
  data: [],
  total: 0,
  params: {} as DataParams,
  allData: []
}

const appServicesSlice: any = createSlice({
  name: 'appServices',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.data = action.payload
        state.total = action.payload.length
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        console.log('State before deletion:', state)

        state.data = state.data.filter(service => service.id !== action.payload.id)
        console.log('State after deletion:', state)
      })
  }
})

export default appServicesSlice.reducer
