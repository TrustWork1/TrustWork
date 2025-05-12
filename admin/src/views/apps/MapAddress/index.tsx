import { Autocomplete, AutocompleteInputChangeReason, Box, FormLabel, Grid, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { debounce } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { UseFormClearErrors, UseFormSetValue, FieldValues, Path, PathValue } from 'react-hook-form'

export type Prediction = {
  description: string
  place_id: string
}

export type TGoogleMapPlaceHelperDetailsResponse = {
  result: {
    formatted_address: string
    address_components: AddressComponent[]
    geometry: {
      location: { lat: number; lng: number }
    }
    vicinity: string
  }
  status: string
}

export type AddressComponent = {
  long_name: string
  short_name: string
  types: string[]
}

type MapAddressProps<T extends FieldValues> = {
  setValue?: UseFormSetValue<T>
  clearErrors?: UseFormClearErrors<T>
  loadingDetailsFlag: (flag: boolean) => void
}

const parsePlaceDetails = (result: TGoogleMapPlaceHelperDetailsResponse['result']) => {
  const location = {
    lat: result.geometry.location.lat.toString(),
    lng: result.geometry.location.lng.toString()
  }

  const address = {
    city: '',
    state: '',
    country: '',
    zipcode: '',
    street: result.vicinity || ''
  }

  const formattedAddress = result.formatted_address

  result.address_components.forEach(component => {
    if (component.types.includes('locality')) {
      address.city = component.long_name
    }
    if (component.types.includes('administrative_area_level_1')) {
      address.state = component.long_name
    }
    if (component.types.includes('country')) {
      address.country = component.long_name
    }
    if (component.types.includes('postal_code')) {
      address.zipcode = component.long_name
    }
  })

  return { location, address, formattedAddress }
}

const MapAddress = <T extends FieldValues>({ setValue, clearErrors, loadingDetailsFlag }: MapAddressProps<T>) => {
  const [options, setOptions] = useState<Prediction[]>([])
  const [searchText, setSearchText] = useState('')
  // const [loading, setLoading] = useState(false)

  const errorHandler = useCallback((errorKey: 'Place' | 'Search') => {
    toast.error(`Something went wrong with ${errorKey.toLowerCase()}!`)
  }, [])

  const fetchPredictions = useCallback(
    async (query: string) => {
      try {
        const response = await axios.get(`/api/v1/helper/googleLocationHelperSearch/`, {
          params: { input: query },
          headers: { token: process.env.ACCESS_KEY }
        })
        setOptions(response.data.predictions || [])
      } catch (error) {
        errorHandler('Search')
      }
    },
    [errorHandler]
  )

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      const response = await axios.get<TGoogleMapPlaceHelperDetailsResponse>(
        `/api/v1/helper/googleLocationHelperDetails/`,
        {
          params: { input: placeId },
          headers: { token: process.env.ACCESS_KEY }
        }
      )

      if (response.data.status === 'OK') {
        const { location, address, formattedAddress } = parsePlaceDetails(response.data.result)

        if (setValue) {
          // Set individual fields with type-safe values
          setValue('city' as Path<T>, address.city as PathValue<T, Path<T>>)
          setValue('state' as Path<T>, address.state as PathValue<T, Path<T>>)
          setValue('country' as Path<T>, address.country as PathValue<T, Path<T>>)
          setValue('zip_code' as Path<T>, address.zipcode as PathValue<T, Path<T>>)
          setValue('address' as Path<T>, formattedAddress as PathValue<T, Path<T>>)
          setValue('street' as Path<T>, address.street as PathValue<T, Path<T>>)

          setValue('project_address' as Path<T>, formattedAddress as PathValue<T, Path<T>>)
          setValue('project_location' as Path<T>, address.country as PathValue<T, Path<T>>)

          // Set location fields (Later required enable the same)
          setValue('latitude' as Path<T>, location.lat as PathValue<T, Path<T>>)
          setValue('longitude' as Path<T>, location.lng as PathValue<T, Path<T>>)

          // Clear errors for each field
          if (clearErrors) {
            clearErrors('address' as Path<T>)
            clearErrors('city' as Path<T>)
            clearErrors('state' as Path<T>)
            clearErrors('country' as Path<T>)
            clearErrors('zip_code' as Path<T>)
            clearErrors('street' as Path<T>)
            clearErrors('latitude' as Path<T>)
            clearErrors('longitude' as Path<T>)

            clearErrors('project_address' as Path<T>)
            clearErrors('project_location' as Path<T>)
          }
          loadingDetailsFlag(false)
        } else {
          loadingDetailsFlag(false)

          return { address, location }
        }
      } else {
        errorHandler('Place')
      }
    } catch (error) {
      loadingDetailsFlag(false)
      errorHandler('Place')
    }
  }

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        fetchPredictions(value)
      }, 300),
    [fetchPredictions]
  )

  const handleInputChange = (
    event: React.SyntheticEvent,
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reason: AutocompleteInputChangeReason
  ): void => {
    setSearchText(value)
    debouncedSearch(value)
  }

  const handleOptionSelect = async (event: React.SyntheticEvent, value: Prediction | null) => {
    if (value) {
      loadingDetailsFlag(true)
      await fetchPlaceDetails(value.place_id)
    }
  }

  return (
    <Box>
      <FormLabel>Search Address</FormLabel>
      <Autocomplete
        options={options}
        getOptionLabel={option => option.description}
        filterOptions={x => x}
        noOptionsText='No locations'
        inputValue={searchText}
        disableClearable
        onInputChange={handleInputChange}
        onChange={handleOptionSelect}
        renderInput={params => <TextField {...params} placeholder='Enter to search your address' fullWidth />}
        renderOption={(props, option) => (
          <li {...props}>
            <Grid container alignItems='center'>
              <Grid item>
                <Typography variant='body2'>{option.description}</Typography>
              </Grid>
            </Grid>
          </li>
        )}
      />
    </Box>
  )
}

export default MapAddress
