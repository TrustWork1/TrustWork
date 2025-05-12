/* eslint-disable lines-around-comment */
// ** React Imports
import { useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import { createFilterOptions, Grid, MenuItem, TextField } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** YUP Validation Imports
import { projectCreateValidationSchema, projectUpdateValidationSchema } from 'src/validation/project.validation'

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** API Imports
import { commonClientList, commonJobCategoriesList } from 'src/services/functions/common.api'

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'
import { TEachJobCategory } from 'src/types/apps/common.type'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { handleAlphaKeys, handleNumberKeysOnly } from 'src/lib/functions/validationFn'
import MapAddress from '../../MapAddress'
import { Loader } from 'lucide-react'
import { fetchProjectById, storeProject, updateProject } from 'src/services/functions/projects.api'
import { TClientType } from 'src/types/apps/client'
import { useDebounce } from 'src/hooks/useDebounce'
import { fetchClientById } from 'src/services/functions/client.api'
import CustomButtonPrimary from 'src/ui/Icons/CustomButtons/CustomButtonPrimary'

// ** Types Imports

interface SidebarAddEditType {
  open: boolean
  toggle: () => void
  mode: 'add' | 'edit'
  id: null | number | string
}

interface TProject {
  project_timeline: string
  project_budget: string
  project_hrs_week: string
  project_address: string
  project_description: string
  project_title: string
  project_location: any
  country: any
  project_category: any
  client: any
  latitude: string
  longitude: string
  zip_code: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const defaultValues: TProject = {
  project_timeline: '',
  project_budget: '',
  project_hrs_week: 'Hrs',
  project_address: '',
  project_description: '',
  project_title: '',
  project_category: 0,
  client: 0,
  project_location: '',
  latitude: '',
  longitude: '',
  country: '',
  zip_code: ''
}

const SidebarAddEdit = (props: SidebarAddEditType) => {
  const [getLoadingDetailsFlag, setLoadingDetailsFlag] = useState(false)

  // ** Props
  const { open, toggle, mode, id } = props
  const [getClientSearch, setClientSearch] = useState('')
  const [getRetrievedClient, setRetrievedClient] = useState<TClientType | null>(null)
  const clientSearchParam = useDebounce(getClientSearch, 500)

  const validationSchema = mode === 'edit' ? projectUpdateValidationSchema : projectCreateValidationSchema

  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    clearErrors,
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
    queryKey: ['fetchProjectById', id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id && mode === 'edit'
  })

  // ================================================================
  // ================================================================
  const { data: clientListData } = useQuery({
    queryKey: ['commonClientList', clientSearchParam],
    queryFn: () =>
      commonClientList({
        search: clientSearchParam
      })
  })
  const clientData = useMemo(() => {
    if (clientListData?.data) {
      return clientListData.data
    } else {
      return []
    }
  }, [clientListData?.data])

  const { mutateAsync: fetchClientDataById } = useMutation({
    mutationKey: ['fetchClientDataById'],
    mutationFn: fetchClientById,
    onSuccess: async res => {
      // console.log(res.status, res.data, 'res')
      if (res.status === 200) {
        // setValue('client', res.id)
        setRetrievedClient(res.data)
      }
    }
  })
  // ================================================================
  // ================================================================
  const { data: commonJobCategoryData } = useQuery({
    queryKey: ['commonJobCategoriesList'],
    queryFn: commonJobCategoriesList
  })
  const jobCategory: TEachJobCategory[] = useMemo(() => {
    if (commonJobCategoryData?.data) {
      return commonJobCategoryData.data
    } else {
      return []
    }
  }, [commonJobCategoryData?.data])
  // ================================================================
  // ================================================================

  // ** Populate the form fields when data is available
  useEffect(() => {
    if (data?.data && mode === 'edit') {
      setValue('project_category', data.data.project_category?.id)
      setValue('project_location', data.data.country)
      setValue('project_title', data.data.project_title)
      setValue('project_description', data.data.project_description)
      setValue('project_address', data.data.project_address)
      setValue('project_budget', data.data.project_budget)
      setValue('project_timeline', data.data.project_timeline)
      setValue('project_hrs_week', data.data.project_hrs_week || 'Hrs')
      setValue('client', data.data.client?.id)
      setValue('latitude', data.data.latitude)
      setValue('longitude', data.data.longitude)

      fetchClientDataById(data?.data?.client?.id)
    } else if (mode === 'add') {
      reset(defaultValues)
      setRetrievedClient(null)
      setClientSearch('')
    }
  }, [data?.data, setValue, mode, reset, open, fetchClientDataById])

  useEffect(() => {
    if (open && id) {
      refetch()
    }
  }, [open, id, refetch])

  // ** Mutation for updating user
  const updateMutator = useMutation({
    mutationKey: ['updateProject', id],
    mutationFn: (formData: TProject) => updateProject(id as string, formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchProjects'] })
    }
  })

  // ** Mutation for storing new user
  const storeMutator = useMutation({
    mutationKey: ['storeProject'],
    mutationFn: (formData: TProject) => storeProject(formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchProjects'] })
    }
  })

  console.log(errors, 'errors')

  // ** Form submission handler
  const onSubmit = async (formData: TProject) => {
    try {
      if (mode === 'edit') {
        await updateMutator.mutateAsync({
          ...formData,
          country: formData?.project_location
          // project_timeline: `${formData?.project_timeline} ${formData?.project_hrs_week}`
        })
      } else {
        await storeMutator.mutateAsync({
          ...formData,
          country: formData?.project_location
          // project_timeline: `${formData?.project_timeline} ${formData?.project_hrs_week}`
        })
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

  const filterOptions = createFilterOptions({
    stringify: (option: TClientType) => `${option?.full_name} ${option?.email}`
  })

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true, disableScrollLock: !open }}
      sx={{
        '& .MuiDrawer-paper': { width: { xs: 500, sm: 600 } },
        visibility: open ? 'visible' : 'hidden'
      }}
    >
      <Header>
        <Typography variant='h5'>{props.mode === 'add' ? 'Add Project' : 'Edit Project'}</Typography>
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
            {/* Title */}
            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <Controller
                name='project_title'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    className='project_border_none'
                    value={value}
                    onChange={onChange}
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Project Title*'
                    placeholder='Enter the project title'
                    error={Boolean(errors.project_title)}
                    {...(errors.project_title && { helperText: errors.project_title.message })}
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <label className='project_title'>Project Description*</label>

              <Controller
                name='project_description'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    className='project_description project_border_none text-area-resize'
                    multiline
                    maxRows={4}
                    variant='filled'
                    id='textarea-filled-controlled'
                    value={value}
                    onChange={onChange}
                    fullWidth
                    sx={{ mb: 4 }}
                    // label='Project Description*'
                    placeholder='Enter the project description'
                    error={Boolean(errors.project_description)}
                    {...(errors.project_description && { helperText: errors.project_description.message })}
                  />
                )}
              />
            </Grid>

            {/* Category */}
            <Grid item md={12} sx={{ px: 2 }}>
              <Controller
                name='project_category'
                control={control}
                rules={{ required: 'Country is required' }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    className='project_border_none'
                    select
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Category*'
                    id='validation-billing-select'
                    error={Boolean(errors.project_category)}
                    {...(errors.project_category && { helperText: errors.project_category.message as string })}
                    SelectProps={{ value: value, onChange: e => onChange(e) }}
                  >
                    <MenuItem value={getValues('project_category')}>Select Category</MenuItem>
                    {jobCategory?.map(eachJob => (
                      <MenuItem key={eachJob?.id} value={eachJob.id}>
                        {eachJob?.title}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Timeline */}
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='project_timeline'
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <CustomTextField
                    className='project_border_none'
                    fullWidth
                    type='text'
                    sx={{ mb: 4 }}
                    value={value}
                    onChange={e => {
                      // console.log(e?.currentTarget?.value)

                      const value = e?.currentTarget?.value

                      const numberValue = Number(value)
                      if (!isNaN(numberValue) && value.trim() !== '') {
                        setValue('project_timeline', value)
                        setError('project_timeline', { message: '' })
                      } else {
                        setValue('project_timeline', '', { shouldDirty: true })
                        setError('project_timeline', { type: 'validate', message: 'Please check the value' })
                      }
                    }}
                    label='Timeline*'
                    placeholder='Enter the project timeline'
                    error={Boolean(errors.project_timeline)}
                    {...(errors.project_timeline && { helperText: errors.project_timeline.message as string })}
                    onKeyDown={handleNumberKeysOnly}
                  />
                )}
              />
            </Grid>

            {/* Hrs/Week */}
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='project_hrs_week'
                control={control}
                rules={{ required: 'Country is required' }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    className='project_border_none'
                    select
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Hrs/Week*'
                    id='validation-billing-select'
                    error={Boolean(errors.project_hrs_week)}
                    {...(errors.project_hrs_week && { helperText: errors.project_hrs_week.message as string })}
                    SelectProps={{ value: value, onChange: e => onChange(e) }}
                  >
                    <MenuItem key='Hrs' value='Hrs'>
                      Hrs
                    </MenuItem>
                    <MenuItem key='Days' value='Days'>
                      Days
                    </MenuItem>
                    <MenuItem key='Weeks' value='Weeks'>
                      Weeks
                    </MenuItem>
                    <MenuItem key='Months' value='Months'>
                      Months
                    </MenuItem>
                    <MenuItem key='Years' value='Years'>
                      Years
                    </MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Budget */}
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='project_budget'
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <CustomTextField
                    className='project_border_none'
                    fullWidth
                    type='text'
                    sx={{ mb: 4 }}
                    label='Budget*'
                    value={value}
                    onChange={e => {
                      // console.log(e?.currentTarget?.value)

                      const value = e?.currentTarget?.value

                      const numberValue = Number(value)
                      if (!isNaN(numberValue) && value.trim() !== '') {
                        setValue('project_budget', value)
                        setError('project_budget', { message: '' })
                      } else {
                        setValue('project_budget', '', { shouldDirty: true })
                        setError('project_budget', { type: 'validate', message: 'Please check the value' })
                      }
                    }}
                    placeholder='Enter the project budget'
                    error={Boolean(errors.project_budget)}
                    {...(errors.project_budget && { helperText: errors.project_budget.message as string })}
                    onKeyDown={handleNumberKeysOnly}
                  />
                )}
              />
            </Grid>

            <Grid item md={6} sx={{ px: 3, mb: 3 }}>
              <Controller
                name='client'
                control={control}
                rules={{ required: 'Service is required' }}
                render={({ field: { onChange } }) => {
                  return (
                    <CustomAutocomplete
                      className='project_border_none'
                      options={clientData ?? []}
                      id='autocomplete-limit-tags'
                      getOptionLabel={(each: TClientType) => each?.full_name || ''}
                      filterOptions={filterOptions}
                      // onInputChange={(e, newValue) => {
                      //   console.log('e', e, newValue)
                      //   setClientSearch(newValue)
                      // }}
                      value={getRetrievedClient}
                      onChange={(event, newValue) => {
                        console.log(newValue, event, 'newValue')
                        // setClientSearch(event?.currentTarget?.value)
                        setRetrievedClient(newValue)
                        onChange(newValue?.id)
                      }}
                      renderOption={(props, option) => (
                        <Box
                          component='li'
                          {...props}
                          display='flex'
                          flexDirection='column'
                          alignItems='flex-start'
                          justifyContent='flex-start'
                          justifyItems='flex-start'
                          borderBottom='1px solid silver'
                        >
                          <Typography sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                            {option?.full_name || 'NA'}
                          </Typography>
                          <Typography sx={{ fontSize: '14px' }}>{`(${option?.email || 'NA'})`}</Typography>
                        </Box>
                      )}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          onChange={e => {
                            setClientSearch(e.currentTarget.value)
                            // console.log(e.currentTarget.value, 'value')
                          }}
                          label='Client*'
                          placeholder='Search or choose client'
                        />
                      )}
                    />
                  )
                }}
              />
              {errors.client && <Typography color='#EA5455'>{errors.client.message as string}</Typography>}
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

            {getLoadingDetailsFlag ? (
              <Grid item md={12} display='center' justifyContent='center' sx={{ px: 2, mb: 2 }}>
                <Loader />
              </Grid>
            ) : null}

            <Grid item md={12} sx={{ px: 2 }}>
              <Controller
                name='project_address'
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
                    error={Boolean(errors.project_address)}
                    {...(errors.project_address && { helperText: errors.project_address.message })}
                  />
                )}
              />
            </Grid>

            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='project_location'
                control={control}
                rules={{ required: 'Location is required' }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Location*'
                    onChange={onChange}
                    placeholder='Location'
                    error={Boolean(errors.project_location)}
                    onKeyDown={handleAlphaKeys}
                    {...(errors.project_location && { helperText: errors.project_location.message as string })}
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

            {/*  */}
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
                if (getValues('project_location') <= 0) {
                  setValue('project_location', undefined)
                  setError('project_location', { message: 'Location is required field' })
                }
                if (getValues('project_category') <= 0) {
                  setValue('project_category', undefined)
                  setError('project_category', { message: 'Category is required field' })
                }
                if (getValues('client') <= 0) {
                  setValue('client', undefined)
                  setError('client', { message: 'Client is required field' })
                }

                handleSubmit(onSubmit)()
              }}
            >
              {mode === 'add' ? 'Add' : 'Update'}
            </CustomButtonPrimary>
            <Button
              variant='tonal'
              color='secondary'
              onClick={handleClose}
              disabled={mode === 'add' ? storeMutator.isPending : updateMutator.isPending}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddEdit
