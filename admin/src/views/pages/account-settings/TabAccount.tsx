/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, ElementType, ChangeEvent, useMemo, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Button, { ButtonProps } from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { updateProfileSchema } from 'src/validation/updateProfile.validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { handleAlphaKeys, handleNumberKeysOnly, handlePhoneNumberKeys } from 'src/lib/functions/validationFn'
import { commonLocationList } from 'src/services/functions/common.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchProviderById } from 'src/services/functions/provider.api'
import { adminDetailFetchFn, adminDetailUpdateFn } from 'src/services/functions/admin.api'
import { globalSuccess } from 'src/lib/functions/_helpers.lib'
import { IMAGE_ACCEPT } from 'src/configs/constant'
import validationConfig from '../../../validation/validationConfig/index'
import { useAuth } from 'src/hooks/useAuth'
import authConfig from 'src/configs/auth'
import MapAddress from 'src/views/apps/MapAddress'
import { Loader } from 'lucide-react'
import { TextField } from '@mui/material'

// ** Icon Imports

type TUdateProfileData = {
  profile_image?: any
  full_name: string
  email: string
  phone: string
  address: string
  state: string
  zip_code: string
  street: string
  city: string
  latitude: string
  longitude: string
  country: any
}

const initialData: TUdateProfileData = {
  full_name: '',
  phone: '',
  email: '',
  profile_image: '',
  address: '',
  street: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  latitude: '',
  longitude: ''
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))

const TabAccount = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [userInput, setUserInput] = useState<string>('yes')
  const [formData, setFormData] = useState<TUdateProfileData>(initialData)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/15.png')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  const [uploadProfileImage, setUploadProfileImage] = useState<File | ''>('')
  const [getLoadingDetailsFlag, setLoadingDetailsFlag] = useState(false)

  // ** Hooks
  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm<TUdateProfileData>({ resolver: yupResolver(updateProfileSchema) })

  const { setUser } = useAuth()

  const { data: userDetails } = useQuery({
    queryKey: ['adminDetailFetchFn'],
    queryFn: adminDetailFetchFn,
    select(data) {
      return data?.data
    }
  })

  const { data: countryData } = useQuery({
    queryKey: ['commonLocationList'],
    queryFn: commonLocationList
  })
  const countries = useMemo(() => {
    if (countryData?.data) {
      return countryData.data
    } else {
      return []
    }
  }, [countryData?.data])

  const updateMutator = useMutation({
    mutationKey: ['adminDetailUpdateFn'],
    mutationFn: adminDetailUpdateFn,
    onSuccess: response => {
      console.log(response.data, 'data')
      globalSuccess(response?.message)
      setUser({ ...response.data })
      // console.log(response.data, 'response.data?.data?.UserData')
      window.localStorage.setItem(authConfig.sessionData, JSON.stringify(response.data))
    }
  })

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  // const onSubmit = () => setOpen(true)
  const onSubmit = async (data: TUdateProfileData) => {
    try {
      // console.log(data, 'formData')
      const formData = new FormData()

      formData.append('full_name', data.full_name)
      formData.append('phone', data.phone)
      formData.append('address', data.address)
      formData.append('state', data.state)
      formData.append('zip_code', data.zip_code)
      formData.append('city', data.city)
      formData.append('country', data.country)
      formData.append('latitude', data.latitude)
      formData.append('longitude', data.longitude)

      if (data.profile_image !== undefined) {
        formData.append('profile_image', data.profile_image)
      }

      await updateMutator.mutateAsync(formData)
    } catch (e) {
      console.error('Error saving data', e)
    }
  }
  console.log(errors, 'errors')

  const handleConfirmation = (value: string) => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

  useMemo(() => {
    setValue('full_name', userDetails?.full_name || '')
    setValue('email', userDetails?.email || '')
    setValue('phone', userDetails?.phone || '')
    setValue('address', userDetails?.address || '')
    setValue('state', userDetails?.state || '')
    setValue('zip_code', userDetails?.zip_code || '')
    setValue('city', userDetails?.city || '')
    setValue('country', userDetails?.country || '')
    setValue('latitude', userDetails?.latitude || '')
    setValue('longitude', userDetails?.longitude || '')
  }, [JSON.stringify(userDetails)])

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        console.log(reader, 'reader')
        setInputValue(reader.result as string)
      }

      setValue('profile_image', files[0])
      setError('profile_image', { message: '' })

      setUploadProfileImage(files[0])
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/15.png')
    setValue('profile_image', undefined)
    setError('profile_image', { message: '' })
  }

  const handleFormChange = (field: keyof TUdateProfileData, value: TUdateProfileData[keyof TUdateProfileData]) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Profile Details' />
          <form onSubmit={e => e.preventDefault()}>
            {/* <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <div>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      value={inputValue}
                      accept={IMAGE_ACCEPT}
                      onChange={handleInputImageChange}
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                    Reset
                  </ResetButtonStyled>
                  {errors.profile_image && Boolean(errors.profile_image?.message !== '') && (
                    <Typography
                      sx={{
                        mt: 4,
                        color: 'red'
                      }}
                    >
                      {`*${validationConfig.error.invalidImageFileFormat as string}`}
                    </Typography>
                  )}
                </div>
              </Box>
            </CardContent>
            <Divider /> */}
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
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
                        {...(errors.full_name && { helperText: errors.full_name.message as string })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                        label='Email'
                        sx={{ mb: 4 }}
                        error={Boolean(errors.email)}
                        disabled
                        placeholder='Enter the email id'
                        {...(errors.email && { helperText: errors.email.message as string })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                        onKeyDown={handlePhoneNumberKeys}
                        error={Boolean(errors.phone)}
                        {...(errors.phone && { helperText: errors.phone.message as string })}
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
                        label='Zip Code*'
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

                {/* <Grid item xs={12} sm={6}>
                  <Controller
                    name='address'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        value={value}
                        onChange={onChange}
                        fullWidth
                        sx={{ mb: 4 }}
                        label='Address*'
                        placeholder='Address'
                        error={Boolean(errors.address)}
                        {...(errors.address && { helperText: errors.address.message as string })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='state'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        value={value}
                        onChange={onChange}
                        fullWidth
                        sx={{ mb: 4 }}
                        label='State*'
                        placeholder='State'
                        error={Boolean(errors.state)}
                        onKeyDown={handleAlphaKeys}
                        {...(errors.state && { helperText: errors.state.message as string })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='zip_code'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        value={value}
                        onChange={onChange}
                        fullWidth
                        type='number'
                        sx={{ mb: 4 }}
                        label='Zip Code'
                        placeholder='Zip code'
                        error={Boolean(errors.zip_code)}
                        {...(errors.zip_code && { helperText: errors.zip_code.message as string })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='country'
                    control={control}
                    rules={{ required: 'Country is required' }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        select
                        fullWidth
                        sx={{ mb: 4 }}
                        label='Country*'
                        id='validation-billing-select'
                        error={Boolean(errors.country)}
                        {...(errors.country && { helperText: errors.country.message as string })}
                        SelectProps={{ value: value, onChange: e => onChange(e) }}
                      >
                        <MenuItem value={0}>Select Country</MenuItem>
                        {countries.map((item: { id: string; country: string }) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.country}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid> */}

                <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                  <Button
                    variant='contained'
                    sx={{ mr: 4 }}
                    onClick={() => {
                      // console.log(getValues('country'), getValues('country') <= 0, 'sdfsdfsdf')
                      if (getValues('country') <= 0) {
                        setValue('country', undefined)
                        setError('country', { message: 'Country is required field' })
                      }

                      handleSubmit(onSubmit)()
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type='reset'
                    variant='tonal'
                    color='secondary'
                    onClick={() => {
                      reset({ ...initialData, country: 0, email: userDetails?.email })
                      setFormData(initialData)
                    }}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>

      {/* Delete Account Card */}
      {/* <Grid item xs={12}>
        <Card>
          <CardHeader title='Delete Account' />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <FormControl>
                  <Controller
                    name='checkbox'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControlLabel
                        label='I confirm my account deactivation'
                        sx={{ '& .MuiTypography-root': { color: errors.checkbox ? 'error.main' : 'text.secondary' } }}
                        control={
                          <Checkbox
                            {...field}
                            size='small'
                            name='validation-basic-checkbox'
                            sx={errors.checkbox ? { color: 'error.main' } : null}
                          />
                        }
                      />
                    )}
                  />
                  {errors.checkbox && (
                    <FormHelperText
                      id='validation-basic-checkbox'
                      sx={{ mx: 0, color: 'error.main', fontSize: theme => theme.typography.body2.fontSize }}
                    >
                      Please confirm you want to delete account
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Button variant='contained' color='error' type='submit' disabled={errors.checkbox !== undefined}>
                Deactivate Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid> */}

      {/* Deactivate Account Dialogs */}
      {/* <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 6, color: 'warning.main' }
            }}
          >
            <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
            <Typography>Are you sure you would like to cancel your subscription?</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
            Yes
          </Button>
          <Button variant='tonal' color='secondary' onClick={() => handleConfirmation('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth maxWidth='xs' open={secondDialogOpen} onClose={handleSecondDialogClose}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 8,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon fontSize='5.5rem' icon={userInput === 'yes' ? 'tabler:circle-check' : 'tabler:circle-x'} />
            <Typography variant='h4' sx={{ mb: 5 }}>
              {userInput === 'yes' ? 'Deleted!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? 'Your subscription cancelled successfully.' : 'Unsubscription Cancelled!!'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog> */}
    </Grid>
  )
}

export default TabAccount
