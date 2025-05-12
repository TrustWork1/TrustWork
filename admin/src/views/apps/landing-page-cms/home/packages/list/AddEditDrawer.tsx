/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable lines-around-comment */
// ** React Imports
import { ChangeEvent, ElementType, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import { Grid, MenuItem, TextField, Checkbox, FormControlLabel, IconButton as MuiIconButton } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm, useFieldArray } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import { savePackagesList, updatePackagesList } from 'src/services/functions/home-cms.api'
import CustomButtonPrimary from 'src/ui/Icons/CustomButtons/CustomButtonPrimary'
import * as yup from 'yup'
import { packageCreateValidationSchema, packageUpdateValidationSchema } from 'src/validation/home-package.validation'

// ** Types Imports
interface SidebarAddEditType {
  open: boolean
  toggle: () => void
  mode: 'add' | 'edit'
  id: null | number | string
  fullRowDetails: PackageData | undefined
}

interface Feature {
  id?: number
  features: string
  is_active: string
}

interface PackageData {
  id?: number
  plan_name: string
  description: string
  price: string
  billing_cycle: string
  features: Feature[]
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const defaultValues: PackageData = {
  plan_name: '',
  description: '',
  price: '',
  billing_cycle: '',
  features: [{ features: '', is_active: 'true' }]
}

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))


const SidebarAddEdit = (props: SidebarAddEditType) => {
  // ** Props
  const { open, toggle, mode, id } = props

  const validationSchema = mode === 'edit' ? packageUpdateValidationSchema : packageCreateValidationSchema

  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema())
  })

  console.log(errors)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features'
  })

  // ** React Query Client
  const queryClient = useQueryClient()

  // ** Populate the form fields when data is available
  useEffect(() => {
    if (props.fullRowDetails && mode === 'edit') {
      setValue('plan_name', props.fullRowDetails.plan_name)
      setValue('description', props.fullRowDetails.description)
      setValue('price', props.fullRowDetails.price)
      setValue('billing_cycle', props.fullRowDetails.billing_cycle)
      
      // Clear default features and set from data
      if (props.fullRowDetails.features && props.fullRowDetails.features.length > 0) {
        setValue('features', props.fullRowDetails.features)
      }
    } else if (mode === 'add') {
      reset(defaultValues)
    }
  }, [props.fullRowDetails, setValue, mode, reset, open])

  // ** Mutation for updating package
  const updateMutator = useMutation({
    mutationKey: [listOfUniqueKeys.home.packages.update, id],
    mutationFn: (formData: FormData) => updatePackagesList(id as string, formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: [listOfUniqueKeys.home.packages.list] })
    }
  })

  // ** Mutation for storing new package
  const storeMutator = useMutation({
    mutationKey: [[listOfUniqueKeys.home.packages.save]],
    mutationFn: (formData: FormData) => savePackagesList(formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: [listOfUniqueKeys.home.packages.list] })
    }
  })

  // ** Form submission handler
  const onSubmit = async (data: PackageData) => {
    try {
      const formData = new FormData();
      formData.append('plan_name', data.plan_name);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('billing_cycle', data.billing_cycle);
      
      formData.append('features', JSON.stringify(data.features));
      
      if (mode === 'edit') {
        await updateMutator.mutateAsync(formData);
      } else {
        await storeMutator.mutateAsync(formData);
      }
      
      // Reset form and close modal
      toggle();
      reset();
    } catch (e) {
      console.error('Error saving data', e);
    }
  }
  

  const handleClose = () => {
    toggle()
    reset()
  }

  const addFeature = () => {
    append({ features: '', is_active: 'true' })
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
        <Typography variant='h5'>{props.mode === 'add' ? 'Add ' : 'Edit '}Plan</Typography>
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
            {/* Plan name */}
            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <Controller
                name='plan_name'
                control={control}
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

            {/* Plan description */}
            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <label className='project_title'>Plan Description*</label>
              <Controller
                name='description'
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
                    placeholder='Enter the plan description'
                    error={Boolean(errors.description)}
                    {...(errors.description && { helperText: errors.description.message })}
                  />
                )}
              />
            </Grid>

            {/* Plan price */}
            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <Controller
                name='price'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    className='project_border_none'
                    value={value}
                    onChange={onChange}
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Plan Price*'
                    placeholder='Enter the plan price'
                    error={Boolean(errors.price)}
                    {...(errors.price && { helperText: errors.price.message })}
                  />
                )}
              />
            </Grid>

            {/* Plan Billing Cycle */}
            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <Controller
                name='billing_cycle'
                control={control}
                rules={{ required: 'Billing cycle is required' }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    className='project_border_none'
                    select
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Billing Cycle*'
                    id='validation-billing-select'
                    error={Boolean(errors.billing_cycle)}
                    {...(errors.billing_cycle && { helperText: errors.billing_cycle.message as string })}
                    SelectProps={{ value: value, onChange: e => onChange(e) }}
                  >
                    <MenuItem key='Week' value='Week'>
                      Weekly
                    </MenuItem>
                    <MenuItem key='Month' value='Month'>
                      Monthly
                    </MenuItem>
                    <MenuItem key='Year' value='Year'>
                      Yearly
                    </MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Features Section */}
            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant='h6'>Features</Typography>
                <Button 
                  variant='contained' 
                  color='primary' 
                  startIcon={<Icon icon='tabler:plus' />}
                  onClick={addFeature}
                >
                  Add Feature
                </Button>
              </Box>
              
              {fields.map((field, index) => (
                <Box key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant='subtitle2'>Feature {index + 1}</Typography>
                    {fields.length > 1 && (
                      <MuiIconButton color='error' onClick={() => remove(index)}>
                        <Icon icon='tabler:trash' />
                      </MuiIconButton>
                    )}
                  </Box>
                  
                  <Controller
                    name={`features.${index}.features`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        sx={{ mb: 2 }}
                        label='Feature*'
                        placeholder='Enter feature description'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.features?.[index]?.features)}
                        helperText={errors.features?.[index]?.features?.message}
                      />
                    )}
                  />
                  
                  {/* <Controller
                    name={`features.${index}.is_active`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={value === 'true'} 
                            onChange={e => onChange(e.target.checked ? 'true' : 'false')}
                          />
                        }
                        label="Active"
                      />
                    )}
                  /> */}
                </Box>
              ))}
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
