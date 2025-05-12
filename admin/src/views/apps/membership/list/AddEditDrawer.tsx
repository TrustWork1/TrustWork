/* eslint-disable lines-around-comment */
// ** React Imports
import { useEffect } from 'react'

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
import {
  membershipCreateValidationSchema,
  membershipUpdateValidationSchema
} from 'src/validation/membership.validation'

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'
import { handlePhoneNumberKeys } from 'src/lib/functions/validationFn'
import { fetchMembershipById, storeMembership, updateMembership } from 'src/services/functions/membership.api'
import { TMembershipAddParam } from 'src/types/apps/membership.type'
import CustomButtonPrimary from 'src/ui/Icons/CustomButtons/CustomButtonPrimary'

// ** Types Imports

interface SidebarAddEditType {
  open: boolean
  toggle: () => void
  mode: 'add' | 'edit'
  id: null | number | string
}

interface TMembership {
  // user_type: any;
  user_type: string
  plan_name: string
  plan_price: string
  plan_details: string
  // plan_duration: string
  // plan_hrs_week: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const defaultValues: TMembership = {
  // plan_duration: '',
  // plan_hrs_week: 'Monthly',
  plan_details: '',
  plan_price: '',
  user_type: '',
  plan_name: ''
}

const SidebarAddEdit = (props: SidebarAddEditType) => {
  // ** Props
  const { open, toggle, mode, id } = props

  const validationSchema = mode === 'edit' ? membershipUpdateValidationSchema : membershipCreateValidationSchema

  const {
    reset,
    control,
    setValue,
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
    queryKey: ['fetchMembershipById', id],
    queryFn: () => fetchMembershipById(id),
    enabled: !!id && mode === 'edit'
  })

  // ================================================================
  // ================================================================

  // ** Populate the form fields when data is available
  useEffect(() => {
    if (data?.data && mode === 'edit') {
      setValue('user_type', data.data.user_type)
      setValue('plan_name', data.data.plan_name)
      setValue('plan_price', data.data.plan_price)
      setValue('plan_details', data.data.plan_details)
      // setValue('plan_duration', String(data.data.plan_duration).replace(/\D/g, ''))
      // setValue('plan_hrs_week', String(data.data.plan_duration).replace(/^\d+\s*/, ''))
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
    mutationKey: ['updateMembership', id],
    mutationFn: (formData: TMembershipAddParam) => updateMembership(id as string, formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchMembership'] })
    }
  })

  // ** Mutation for storing new user
  const storeMutator = useMutation({
    mutationKey: ['storeMembership'],
    mutationFn: (formData: TMembershipAddParam) => storeMembership(formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchMembership'] })
    }
  })

  console.log(errors, 'errors')

  // ** Form submission handler
  const onSubmit = async (formData: TMembership) => {
    console.log(formData, 'formData')
    try {
      if (mode === 'edit') {
        await updateMutator.mutateAsync({
          plan_name: formData?.plan_name,
          plan_details: formData?.plan_details,
          plan_price: formData?.plan_price,
          plan_benefits: formData?.plan_details
          // plan_duration: `${formData?.plan_duration} ${formData?.plan_hrs_week}`
        })
      } else {
        await storeMutator.mutateAsync({
          plan_name: formData?.plan_name,
          plan_details: formData?.plan_details,
          plan_price: formData?.plan_price,
          plan_benefits: formData?.plan_details
          // plan_duration: `${formData?.plan_duration} ${formData?.plan_hrs_week}`
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

  // const filterOptions = createFilterOptions({
  //   stringify: (option: TClientType) => `${option?.full_name} ${option?.email}`
  // })

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
        <Typography variant='h5'>{props.mode === 'add' ? 'Add Plan' : 'Edit Plan'}</Typography>
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
            {/* Plan name */}
            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <Controller
                name='plan_name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    className='project_border_none'
                    value={value}
                    onChange={onChange}
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Plan Name*'
                    placeholder='Enter the plan name'
                    error={Boolean(errors.plan_name)}
                    {...(errors.plan_name && { helperText: errors.plan_name.message })}
                  />
                )}
              />
            </Grid>

            {/* Plan benefits */}
            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <label className='project_title'>Plan Benefits*</label>

              <Controller
                name='plan_details'
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
                    placeholder='Enter the plan benefits'
                    error={Boolean(errors.plan_details)}
                    {...(errors.plan_details && { helperText: errors.plan_details.message })}
                  />
                )}
              />
            </Grid>

            {/* User Type */}
            {/* <Grid item md={6} sx={{ px: 2 }}>
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
                    <MenuItem value={0}>Select Category</MenuItem>
                    {jobCategory?.map(eachJob => (
                      <MenuItem key={eachJob?.id} value={eachJob.id}>
                        {eachJob?.title}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid> */}

            {/* Timeline */}
            {/* <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='plan_duration'
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
                        setValue('plan_duration', parseInt(value).toFixed(0))
                        setError('plan_duration', { message: '' })
                      } else {
                        setValue('plan_duration', '', { shouldDirty: true })
                        setError('plan_duration', { type: 'validate', message: 'Please check the value' })
                      }
                    }}
                    label='Plan Timeline*'
                    placeholder='Enter the plan timeline'
                    error={Boolean(errors.plan_duration)}
                    {...(errors.plan_duration && { helperText: errors.plan_duration.message as string })}
                    onKeyDown={handlePhoneNumberKeys}
                  />
                )}
              />
            </Grid> */}

            {/* Hrs/Week */}
            {/* <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='plan_hrs_week'
                control={control}
                rules={{ required: 'Hrs is required' }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    className='project_border_none'
                    select
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Monthly/Yearly*'
                    id='validation-billing-select'
                    error={Boolean(errors.plan_hrs_week)}
                    {...(errors.plan_hrs_week && { helperText: errors.plan_hrs_week.message as string })}
                    SelectProps={{ value: value, onChange: e => onChange(e) }}
                  >
                    <MenuItem key='Monthly' value='Monthly'>
                      Monthly
                    </MenuItem>
                    <MenuItem key='Yearly' value='Yearly'>
                      Yearly
                    </MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid> */}

            {/* Price */}
            <Grid item md={6} sx={{ px: 2 }}>
              <Controller
                name='plan_price'
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <CustomTextField
                    className='project_border_none'
                    fullWidth
                    type='text'
                    sx={{ mb: 4 }}
                    label='Plan Price*'
                    value={value}
                    onChange={e => {
                      // console.log(e?.currentTarget?.value)

                      const value = e?.currentTarget?.value

                      const numberValue = Number(value)
                      if (!isNaN(numberValue) && value.trim() !== '') {
                        setValue('plan_price', parseInt(value).toFixed(0))
                        setError('plan_price', { message: '' })
                      } else {
                        setValue('plan_price', '', { shouldDirty: true })
                        setError('plan_price', { type: 'validate', message: 'Please check the value' })
                      }
                    }}
                    placeholder='Enter the plan price'
                    error={Boolean(errors.plan_price)}
                    {...(errors.plan_price && { helperText: errors.plan_price.message as string })}
                    onKeyDown={handlePhoneNumberKeys}
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
