// ** React Imports
import { useEffect, useState } from 'react'

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
import { validationSchema } from 'src/validation/client.validation'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** API Imports
import { fetchClientById, storeClient, updateClient } from 'src/services/functions/client.api'

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'

// ** Types Imports
import { IClient } from 'src/interface/client.insterface'
import { handleAlphaKeys, handleNumberKeysOnly } from 'src/lib/functions/validationFn'
import MapAddress from '../../MapAddress'
import { Loader } from 'lucide-react'
import CustomButtonPrimary from 'src/ui/Icons/CustomButtons/CustomButtonPrimary'

interface SidebarAddEditType {
  open: boolean
  toggle: () => void
  mode: 'add' | 'edit'
  id: null | number | string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const defaultValues: IClient = {
  full_name: '',
  email: '',
  phone: '',
  address: '',
  street: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  latitude: '',
  longitude: ''
}

const SidebarAddEdit = (props: SidebarAddEditType) => {
  const [getLoadingDetailsFlag, setLoadingDetailsFlag] = useState(false)
  // ** Props
  const { open, toggle, mode, id } = props

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
    resolver: yupResolver(validationSchema)
  })

  // ** React Query Client
  const queryClient = useQueryClient()

  // ** Fetch Client data using React Queries (only when in edit mode)
  const { data, refetch } = useQuery({
    queryKey: ['fetchClientById', id],
    queryFn: () => fetchClientById(id),
    enabled: !!id && mode === 'edit'
  })

  // ** Populate the form fields when data is available
  useEffect(() => {
    if (data?.data && mode === 'edit') {
      setValue('full_name', data.data.full_name)
      setValue('email', data.data.email)
      setValue('phone', data.data.phone)
      setValue('address', data.data.address)
      setValue('city', data.data.city)
      setValue('state', data.data.state)
      setValue('country', data.data.country)
      setValue('zip_code', data.data.zip_code)
      setValue('latitude', data.data.latitude)
      setValue('longitude', data.data.longitude)
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
    mutationKey: ['updateClient', id],
    mutationFn: (formData: IClient) => updateClient(id as string, formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchClients'] })
    }
  })

  // ** Mutation for storing new user
  const storeMutator = useMutation({
    mutationKey: ['storeClient'],
    mutationFn: (formData: IClient) => storeClient(formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchClients'] })
    }
  })

  console.log('form error', errors)

  // ** Form submission handler
  const onSubmit = async (formData: IClient) => {
    try {
      if (mode === 'edit') {
        await updateMutator.mutateAsync(formData)
        console.log('Data Updated successfully', formData)
      } else {
        await storeMutator.mutateAsync(formData)
        console.log('Data Created successfully', formData)
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
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 500, sm: 600 } } }}
    >
      <Header>
        <Typography variant='h5'>{props.mode === 'add' ? 'Add Client' : 'Edit Client'}</Typography>
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
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Full Name*'
                    onChange={onChange}
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
                    fullWidth
                    type='email'
                    label='Email*'
                    value={value}
                    sx={{ mb: 4 }}
                    disabled={mode === 'edit'}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='Enter the email id'
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />
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
                    value={value}
                    sx={{ mb: 4 }}
                    label='Phone Number*'
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
                rules={{ required: true }}
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
                // console.log(getValues('country'), getValues('country') <= 0, 'sdfsdfsdf')
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
