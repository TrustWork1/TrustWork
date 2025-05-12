// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import { Checkbox, Grid, InputAdornment, MenuItem } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** API Imports
import { fetchCompliance, fetchStaffById, storeStaff, updateStaff } from 'src/services/functions/staff.api'
import { fetchServices } from 'src/services/functions/services.api'
import { fetchShiftTime } from 'src/services/functions/shifttime.api'

// ** Types Imports
import { StaffData } from 'src/interface/staff.insterface'

// ** Yup validation schema
import { validationSchema } from 'src/validation/staff.validation'

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'
import CustomButtonPrimary from 'src/ui/Icons/CustomButtons/CustomButtonPrimary'

// import StaffComplianceSection from './StaffComplianceSection'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
  mode: 'add' | 'edit'
  id: number | string
}

interface ServiceOption {
  _id: string
  title: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const defaultValues: StaffData = {
  staff_id: '',
  full_name: '',
  email: '',
  phone: '',
  password: '',
  confirm_password: '',
  address: '',
  city: '',
  state: '',
  landmark: '',
  zipcode: '',
  country: '',
  start_time: '',
  end_time: '',
  dob: '',
  shift_id: '',
  service_ids: [],
  staff_complieation: []
}

const AddEditDrawer = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, mode, id } = props

  // ** React Query Client
  const queryClient = useQueryClient()

  // ** Fetch Staff data using React Queries (only when in edit mode)
  const { data, refetch } = useQuery({
    queryKey: ['fetchStaffById', id],
    queryFn: () => fetchStaffById(id),
    enabled: !!id && mode === 'edit'
  })
  const { data: services } = useQuery({ queryKey: ['fetchServices'], queryFn: fetchServices, enabled: open })
  const { data: shifts } = useQuery({ queryKey: ['fetchShiftTime'], queryFn: fetchShiftTime, enabled: open })
  const { data: compliances } = useQuery({ queryKey: ['compliance'], queryFn: fetchCompliance, enabled: open })

  // ** State
  const [hidePassword, setHidePassword] = useState<boolean>(false)
  const [hideCfmPassword, setCfmPassword] = useState<boolean>(false)
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([])
  const [uploadedFilePreviews, setUploadedFilePreviews] = useState<string[]>([])

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<StaffData>({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema(mode))
  })

  // ** Populate the form fields when data is available
  useEffect(() => {
    if (data?.data && mode === 'edit') {
      const {
        _id,
        full_name,
        email,
        phone,
        address,
        city,
        state,
        landmark,
        zipcode,
        country,
        start_time,
        end_time,
        dob,
        service_data,
        availability_data
      } = data.data

      // Setting simple values
      setValue('staff_id', _id)
      setValue('full_name', full_name)
      setValue('email', email)
      setValue('phone', phone)
      setValue('address', address)
      setValue('city', city)
      setValue('state', state)
      setValue('landmark', landmark)
      setValue('zipcode', zipcode)
      setValue('country', country)
      setValue('start_time', start_time)
      setValue('end_time', end_time)
      setValue('dob', dob)
      setValue('shift_id', availability_data?._id)

      // Handling service_ids
      const service_ids = service_data.map((service: any) => service._id)
      setValue('service_ids', service_ids)

      // Handling staff_complieation (array of objects)
      // if (staff_complieation && staff_complieation.length > 0) {
      //   setValue(
      //     'staff_complieation',
      //     staff_complieation.map((item: any) => ({
      //       document_type_id: item.document_type_id,
      //       staffcompliance_id: item.staffcompliance_id,
      //       file: item.file,
      //       isVerified: item.isVerified
      //     }))
      //   )
      // }
    } else if (mode === 'add') {
      reset(defaultValues)
    }
  }, [data?.data, setValue, mode, reset])

  useEffect(() => {
    if (open && id) {
      refetch()
    }
  }, [open, id, refetch])

  // ** Mutation for updating user
  const updateMutator = useMutation({
    mutationKey: ['updateStaff'],
    mutationFn: updateStaff,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchStaffs'] })
    }
  })

  // ** Mutation for storing new user
  const storeMutator = useMutation({
    mutationKey: ['storeStaff'],
    mutationFn: storeStaff,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchStaffs'] })
    }
  })

  console.log('Form error: ', errors)

  // ** Form submission handler
  const onSubmit = async (formData: StaffData) => {
    console.log('Submitted Form Data', formData)

    const formDataToSend = new FormData()

    if (mode === 'add') {
      // Prepare the staff_complieation data as an array
      const staffComplianceArray = formData.staff_complieation.map(item => ({
        document_type_id: item.document_type_id,
        isVerified: item.isVerified.toString(), // Convert boolean to string
        staffcompliance_id: item.staffcompliance_id
      }))

      // Append staff_complieation as a JSON string
      formDataToSend.append('staff_complieation', JSON.stringify(staffComplianceArray))

      // Loop over the staff_complieation array to append files
      formData.staff_complieation.forEach((item, index) => {
        // Append file if it exists
        if (item.file) {
          formDataToSend.append(`staff_complieation[${index}].file`, item.file, item.file.name)
        }
      })
      formDataToSend.append('password', formData.password)
      formDataToSend.append('confirm_password', formData.confirm_password)
    }

    // Append other form data fields
    formDataToSend.append('staff_id', formData.staff_id ?? '')
    formDataToSend.append('full_name', formData.full_name)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('phone', formData.phone)
    formDataToSend.append('address', formData.address)
    formDataToSend.append('city', formData.city)
    formDataToSend.append('state', formData.state)
    formDataToSend.append('landmark', formData.landmark)
    formDataToSend.append('zipcode', formData.zipcode)
    formDataToSend.append('country', formData.country)
    formDataToSend.append('start_time', formData.start_time)
    formDataToSend.append('end_time', formData.end_time)
    formDataToSend.append('dob', formData.dob)
    formDataToSend.append('shift_id', formData.shift_id)
    formDataToSend.append('service_ids', JSON.stringify(formData.service_ids))

    try {
      if (mode === 'edit') {
        // Send FormData via the API client (axios or fetch, for example)
        await updateMutator.mutateAsync(formDataToSend)
        console.log('Data Updated successfully', formDataToSend)
      } else {
        await storeMutator.mutateAsync(formDataToSend)
        console.log('Data Created successfully', formDataToSend)
      }

      // Reset form and close modal (or whatever you need to do after submission)
      toggle()
      reset()
    } catch (e) {
      console.error('Error saving data', e)
    }
  }

  const handleClose = () => {
    reset(defaultValues)
    setUploadedFileNames([])
    setUploadedFilePreviews([])
    toggle()
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
        <Typography variant='h5'>{mode === 'add' ? 'Add Staff' : 'Edit Staff'}</Typography>
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    label='Full Name'
                    onChange={onChange}
                    placeholder='John Doe'
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
                    label='Email'
                    value={value}
                    sx={{ mb: 4 }}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='johndoe@email.com'
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />
            </Grid>
            {mode === 'add' ? (
              <>
                <Grid item md={6} sx={{ px: 2 }}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        sx={{ mb: 1.5 }}
                        label='Password'
                        value={value}
                        placeholder='············'
                        onChange={onChange}
                        type={hidePassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={() => setHidePassword(prev => !prev)}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <Icon fontSize='1.25rem' icon={hidePassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        error={Boolean(errors.password)}
                        {...(errors.password && { helperText: errors.password.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6} sx={{ px: 2 }}>
                  <Controller
                    name='confirm_password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        sx={{ mb: 1.5 }}
                        label='Confirm Password'
                        value={value}
                        placeholder='············'
                        onChange={onChange}
                        type={hideCfmPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={() => setCfmPassword(prev => !prev)}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <Icon fontSize='1.25rem' icon={hideCfmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        error={Boolean(errors.confirm_password)}
                        {...(errors.confirm_password && { helperText: errors.confirm_password.message })}
                      />
                    )}
                  />
                </Grid>
              </>
            ) : (
              <></>
            )}

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
                    label='Phone Number'
                    onChange={onChange}
                    placeholder='(397) 294-5153'
                    error={Boolean(errors.phone)}
                    {...(errors.phone && { helperText: errors.phone.message })}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='shift_id'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Shift'
                    error={Boolean(errors.shift_id)}
                    helperText={errors.shift_id && 'This field is required'}
                    {...field}
                  >
                    {shifts?.data?.map((shift: any) => (
                      <MenuItem key={shift._id} value={shift._id}>
                        {shift.short_name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='start_time'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Start Time'
                    type='time'
                    error={Boolean(errors.start_time)}
                    helperText={errors.start_time && 'This field is required'}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='end_time'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='End Time'
                    type='time'
                    error={Boolean(errors.end_time)}
                    helperText={errors.end_time && 'This field is required'}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <Controller
                name='service_ids'
                control={control}
                rules={{ required: 'Service is required' }}
                render={({ field: { value, onChange } }) => {
                  console.log('value', value)

                  return (
                    <CustomAutocomplete
                      multiple // This allows the selection of multiple items
                      limitTags={2} // Optional: limits the tags displayed when multiple items are selected
                      options={services?.data ?? []}
                      id='autocomplete-limit-tags'
                      getOptionLabel={(option: ServiceOption) => option.title || ''}
                      value={value.map(id => services?.data.find((service: any) => service._id === id)) || []} // Map IDs to their corresponding objects
                      onChange={(event, newValue) => {
                        console.log('newValue', newValue)

                        // Map the selected ServiceOption objects to their IDs
                        const selectedIds = newValue.map(service => service._id)
                        onChange(selectedIds) // Pass the array of IDs back to react-hook-form's onChange
                      }}
                      renderInput={params => (
                        <CustomTextField {...params} label='Services' placeholder='Choose Service' />
                      )}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='dob'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='date'
                    value={value}
                    sx={{ mb: 4 }}
                    label='Date of Birth'
                    id='autocomplete-input'
                    onChange={onChange}
                    error={Boolean(errors.dob)}
                    {...(errors.dob && { helperText: errors.dob.message })}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Address'
                    id='autocomplete-input'
                    onChange={onChange} // Handle changes correctly
                    placeholder='Address'
                    error={Boolean(errors.address)}
                    {...(errors.address && { helperText: errors.address.message })}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='landmark'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Landmark'
                    onChange={onChange}
                    placeholder='House number'
                    error={Boolean(errors.landmark)}
                    {...(errors.landmark && { helperText: errors.landmark.message })}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='country'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Country'
                    onChange={onChange}
                    placeholder='House number'
                    error={Boolean(errors.country)}
                    {...(errors.country && { helperText: errors.country.message })}
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
                    label='State'
                    onChange={onChange}
                    placeholder='state'
                    error={Boolean(errors.state)}
                    {...(errors.state && { helperText: errors.state.message })}
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
                    label='City'
                    onChange={onChange}
                    placeholder='city'
                    error={Boolean(errors.city)}
                    {...(errors.city && { helperText: errors.city.message })}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='zipcode'
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
                    placeholder='zip code'
                    error={Boolean(errors.zipcode)}
                    {...(errors.zipcode && { helperText: errors.zipcode.message })}
                  />
                )}
              />
            </Grid>
            {mode === 'add' ? (
              <>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='h6' gutterBottom>
                        Staff Compliance
                      </Typography>
                    </Grid>

                    {/* Render existing fields using the data array */}
                    {compliances?.data?.map((compliance: any, index: any) => (
                      <>
                        {/* Compliance Title */}
                        <Grid item xs={4}>
                          <Typography>{compliance.name}</Typography>
                        </Grid>
                        <Grid container spacing={2}>
                          {/* Document Type Dropdown */}
                          <Grid item xs={4}>
                            <Controller
                              name={`staff_complieation.${index}.document_type_id`}
                              control={control}
                              defaultValue={compliance.selectedDocumentTypeId || ''}
                              rules={{ required: true }}
                              render={({ field }) => (
                                <CustomTextField select fullWidth label='Document Type' {...field}>
                                  {compliance.options.map((option: any) => (
                                    <MenuItem key={option._id} value={option._id}>
                                      {option.name}
                                    </MenuItem>
                                  ))}
                                </CustomTextField>
                              )}
                            />
                          </Grid>

                          {/* File Upload */}
                          <Grid item xs={4}>
                            <Typography>Document File</Typography>
                            <Controller
                              name={`staff_complieation.${index}.file`}
                              control={control}
                              render={({ field: { onChange, value, ref } }) => (
                                <>
                                  {value && typeof value === 'string' ? (
                                    <>
                                      {/* Display the uploaded filename for editing */}
                                      <Typography variant='body2' style={{ marginTop: '8px' }}>
                                        Current File: {value}
                                      </Typography>
                                      <Button
                                        variant='outlined'
                                        component='label'
                                        color='secondary'
                                        startIcon={<Icon icon='tabler:cloud-upload' fontSize={20} />}
                                      >
                                        Upload New File
                                        <input
                                          type='file'
                                          accept='image/*'
                                          hidden
                                          ref={ref}
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const file = e.target.files ? e.target.files[0] : null
                                            onChange(file) // Set the file in the form state

                                            if (file) {
                                              // Update file names and preview logic as before
                                              const newFileNames = [...uploadedFileNames]
                                              newFileNames[index] = file.name
                                              setUploadedFileNames(newFileNames)

                                              const reader = new FileReader()
                                              reader.onloadend = () => {
                                                const newPreviews = [...uploadedFilePreviews]
                                                newPreviews[index] = reader.result as string
                                                setUploadedFilePreviews(newPreviews)
                                              }
                                              reader.readAsDataURL(file)
                                            }
                                          }}
                                        />
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      variant='outlined'
                                      component='label'
                                      color='secondary'
                                      startIcon={<Icon icon='tabler:cloud-upload' fontSize={20} />}
                                    >
                                      Upload File
                                      <input
                                        type='file'
                                        accept='image/*'
                                        hidden
                                        ref={ref}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                          const file = e.target.files ? e.target.files[0] : null
                                          onChange(file) // Set the file in the form state

                                          if (file) {
                                            const newFileNames = [...uploadedFileNames]
                                            newFileNames[index] = file.name
                                            setUploadedFileNames(newFileNames)

                                            const reader = new FileReader()
                                            reader.onloadend = () => {
                                              const newPreviews = [...uploadedFilePreviews]
                                              newPreviews[index] = reader.result as string
                                              setUploadedFilePreviews(newPreviews)
                                            }
                                            reader.readAsDataURL(file)
                                          }
                                        }}
                                      />
                                    </Button>
                                  )}
                                </>
                              )}
                            />

                            {/* Display uploaded file name and preview */}
                            {uploadedFileNames[index] && (
                              <Typography variant='body2' style={{ marginTop: '8px' }}>
                                Uploaded File: {uploadedFileNames[index]}
                              </Typography>
                            )}
                            {uploadedFilePreviews[index] && (
                              <img
                                src={uploadedFilePreviews[index]}
                                alt='Uploaded Preview'
                                style={{ marginTop: '8px', maxWidth: '100%', height: 'auto' }}
                              />
                            )}
                          </Grid>

                          {/* Verified Checkbox */}
                          <Grid item xs={4}>
                            <Typography>Is Document Verified?</Typography>
                            <Controller
                              name={`staff_complieation.${index}.isVerified`}
                              control={control}
                              defaultValue={false}
                              render={({ field: { onChange, value, ...rest } }) => (
                                <Checkbox
                                  checked={value || false}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
                                  {...rest}
                                />
                              )}
                            />
                          </Grid>

                          {/* Hidden Field for staffcompliance_id */}
                          <Controller
                            name={`staff_complieation.${index}.staffcompliance_id`}
                            control={control}
                            defaultValue={compliance._id}
                            render={() => <></>}
                          />
                        </Grid>
                      </>
                    )) || []}
                  </Grid>
                </Grid>
              </>
            ) : (
              <></>
            )}
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

export default AddEditDrawer
