// ** React Imports
import { useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import { Grid, TextField } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** YUP Validation Imports
import { providerCreateValidationSchema, providerUpdateValidationSchema } from 'src/validation/provider.validation'

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'
import { QueryObserverResult, RefetchOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** API Imports
import { commonProviderServices } from 'src/services/functions/common.api'
import { fetchProviderById, storeProvider, updateProvider } from 'src/services/functions/provider.api'

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { handleAlphaKeys, handleNumberKeysOnly } from 'src/lib/functions/validationFn'
import MapAddress from '../../MapAddress'
import { Loader } from 'lucide-react'
import CustomButtonPrimary from 'src/ui/Icons/CustomButtons/CustomButtonPrimary'
// ** Types Imports

interface SidebarAddEditType {
  open: boolean
  toggle: () => void
  mode: 'add' | 'edit'
  id: null | number | string
  refetchProviderList: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, Error>>
}

interface ServiceOption {
  job_category__id: string
  title: string
}

interface TProvider {
  full_name: string
  email: string
  phone: string
  address: string
  country: any
  city: string
  state: string
  street: string
  zip_code: string
  latitude: string
  longitude: string
  job_category: string[]
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const defaultValues: TProvider = {
  full_name: '',
  email: '',
  phone: '',
  address: '',
  country: '',
  latitude: '',
  longitude: '',
  city: '',
  state: '',
  street: '',
  zip_code: '',
  job_category: []
}

const SidebarAddEdit = (props: SidebarAddEditType) => {
  const [getLoadingDetailsFlag, setLoadingDetailsFlag] = useState(false)
  // ** Props
  const { open, toggle, mode, id, refetchProviderList } = props

  const validationSchema = mode === 'edit' ? providerUpdateValidationSchema : providerCreateValidationSchema

  const {
    reset,
    control,
    setValue,
    clearErrors,
    getValues,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema())
  })

  // ** React Query Client
  const queryClient = useQueryClient()

  // ** Fetch Client data using React Queries (only when in edit mode)
  const { data, refetch } = useQuery({
    queryKey: ['fetchProviderById', id],
    queryFn: () => fetchProviderById(id),
    enabled: !!id && mode === 'edit'
  })

  const { data: servicesData } = useQuery({
    queryKey: ['commonProviderServices'],
    queryFn: commonProviderServices,
    enabled: open
  })
  const services = useMemo(() => {
    if (servicesData?.data) {
      return servicesData.data
    } else {
      return []
    }
  }, [servicesData?.data])

  // ** Populate the form fields when data is available
  useEffect(() => {
    if (data?.data && mode === 'edit') {
      setValue('full_name', data.data.full_name)
      setValue('email', data.data.email)
      setValue('phone', data.data.phone)
      setValue('address', data.data.address)
      setValue('city', data.data.city)
      setValue('state', data.data.state)
      setValue('street', data.data.street)
      setValue('country', data.data.country)
      setValue('zip_code', data.data.zip_code)
      setValue('latitude', data.data.latitude)
      setValue('longitude', data.data.longitude)

      const service_ids = data.data.job_category.map((service: ServiceOption) => service.job_category__id)
      setValue('job_category', service_ids)

      // console.log(service_ids, 'service_ids')
    } else if (mode === 'add') {
      reset(defaultValues)
    }
  }, [data?.data, setValue, mode, reset, open])

  useEffect(() => {
    if (open && id) {
      refetch()
    }
  }, [open, id, refetch])

  // ** Mutation for updating user
  const updateMutator = useMutation({
    mutationKey: ['updateProvider', id],
    mutationFn: (formData: TProvider) => updateProvider(id as string, formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      refetchProviderList()
    }
  })

  // ** Mutation for storing new user
  const storeMutator = useMutation({
    mutationKey: ['storeProvider'],
    mutationFn: (formData: TProvider) => storeProvider(formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      refetchProviderList()
    }
  })

  console.log(errors, 'errors')

  // ** Form submission handler
  const onSubmit = async (formData: TProvider) => {
    try {
      if (mode === 'edit') {
        await updateMutator.mutateAsync(formData)
      } else {
        await storeMutator.mutateAsync(formData)
      }

      // Reset form and close modal (or whatever you need to do after submission)
      toggle()
      reset()
    } catch (e) {
      console.error('Error saving data', e)
    }
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true, disableScrollLock: !open }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 500, sm: 600 } }, visibility: open ? 'visible' : 'hidden' }}
    >
      <Header>
        <Typography variant='h5'>{props.mode === 'add' ? 'Add Provider' : 'Edit Provider'}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form
          onSubmit={e => e.preventDefault()}

          // onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='full_name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    onChange={onChange}
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Full Name*'
                    placeholder='Enter the name'
                    error={Boolean(errors.full_name)}
                    {...(errors.full_name && { helperText: errors.full_name.message })}
                  />
                )}
              />
            </Grid>

            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    onChange={onChange}
                    fullWidth
                    type='email'
                    label='Email*'
                    sx={{ mb: 4 }}
                    disabled={mode === 'edit'}
                    error={Boolean(errors.email)}
                    placeholder='Enter the email id'
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />
            </Grid>

            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <Controller
                name='job_category'
                control={control}
                rules={{ required: 'Service is required' }}
                render={({ field: { value, onChange } }) => {
                  return (
                    <CustomAutocomplete
                      multiple // This allows the selection of multiple items
                      limitTags={4} // Optional: limits the tags displayed when multiple items are selected
                      options={services ?? []}
                      id='autocomplete-limit-tags'
                      getOptionLabel={(option: { id: string; title: string }) => option?.title || ''}
                      value={
                        value.map(job_category__id =>
                          services.find((service: { id: string; title: string }) => service?.id === job_category__id)
                        ) || []
                      } // Map IDs to their corresponding objects
                      onChange={(event, newValue) => {
                        // Map the selected ServiceOption objects to their IDs
                        const selectedIds = newValue.map(service => service?.id)
                        onChange(selectedIds) // Pass the array of IDs back to react-hook-form's onChange
                      }}
                      renderInput={params => (
                        <CustomTextField {...params} label='Services' placeholder='Choose Service' />
                      )}
                    />
                  )
                }}
              />
              {errors.job_category && <Typography color='#EA5455'>{errors.job_category.message}</Typography>}
            </Grid>

            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='tel'
                    sx={{ mb: 4 }}
                    label='Phone Number*'
                    value={value}
                    onChange={onChange}
                    placeholder='Enter the phone'
                    error={Boolean(errors.phone)}
                    {...(errors.phone && { helperText: errors.phone.message })}
                  />
                )}
              />
            </Grid>
            <Grid item md={12} sx={{ px: 2, mb: 2 }}>
              <MapAddress
                setValue={setValue}
                clearErrors={clearErrors}
                loadingDetailsFlag={flag => {
                  setLoadingDetailsFlag(flag)
                }}
              />
            </Grid>
            <Grid item md={12} sx={{ px: 2 }}>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    className='project_description project_border_none'
                    multiline
                    maxRows={4}
                    variant='filled'
                    id='textarea-filled-controlled'
                    value={value}
                    onChange={onChange}
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Address*'
                    placeholder='Enter your address'
                    error={Boolean(errors.address)}
                    {...(errors.address && { helperText: errors.address.message })}
                  />
                )}
              />
            </Grid>

            {getLoadingDetailsFlag ? (
              <Grid item md={12} display='center' justifyContent='center' sx={{ px: 2, mb: 2 }}>
                <Loader />
              </Grid>
            ) : null}

            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='country'
                control={control}
                rules={{ required: 'Country is required' }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Country*'
                    onChange={onChange}
                    placeholder='Country'
                    error={Boolean(errors.country)}
                    onKeyDown={handleAlphaKeys}
                    {...(errors.country && { helperText: errors.country.message as string })}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='state'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='State*'
                    onChange={onChange}
                    placeholder='State'
                    error={Boolean(errors.state)}
                    onKeyDown={handleAlphaKeys}
                    {...(errors.state && { helperText: errors.state.message as string })}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='city'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='City*'
                    onChange={onChange}
                    placeholder='City'
                    error={Boolean(errors.city)}
                    onKeyDown={handleAlphaKeys}
                    {...(errors.city && { helperText: errors.city.message as string })}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='zip_code'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    value={value}
                    sx={{ mb: 4 }}
                    label='Zip Code'
                    onChange={onChange}
                    placeholder='Zip code'
                    error={Boolean(errors.zip_code)}
                    {...(errors.zip_code && { helperText: errors.zip_code.message as string })}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='latitude'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Latitude*'
                    onChange={onChange}
                    placeholder='Latitude'
                    error={Boolean(errors.latitude)}
                    onKeyDown={handleNumberKeysOnly}
                    {...(errors.latitude && { helperText: errors.latitude.message as string })}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='longitude'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Longitude*'
                    onChange={onChange}
                    placeholder='Longitude'
                    error={Boolean(errors.longitude)}
                    onKeyDown={handleNumberKeysOnly}
                    {...(errors.longitude && { helperText: errors.longitude.message as string })}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
            <CustomButtonPrimary
              type='submit'
              variant='contained'
              sx={{ mr: 3 }}
              disabled={mode === 'add' ? storeMutator.isPending : updateMutator.isPending}
              loading={mode === 'add' ? storeMutator.isPending : updateMutator.isPending}
              configLoader={{
                color: 'success',
                size: 20
              }}
              onClick={() => {
                if (getValues('country') <= 0) {
                  setValue('country', undefined)
                  setError('country', { message: 'Country is required field' })
                }

                handleSubmit(onSubmit)()
              }}
            >
              {mode === 'add' ? 'Add' : 'Update'}
            </CustomButtonPrimary>
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddEdit
