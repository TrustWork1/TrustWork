// ** React Imports
import { useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import MuiInputLabel from '@mui/material/InputLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomCheckboxField from 'src/@core/components/check-box'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** API Imports
import { fetchUserById, storeUser, updateUser } from 'src/services/functions/user.api'

// ** Types Imports
import { InputAdornment } from '@mui/material'
import { UserFormData } from 'src/interface/user.insterface'
import { fetchPermissions } from 'src/services/functions/permission.api'

// ** Yup validation schema
import { createSchema, updateSchema } from 'src/validation/manager.validation'

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'

interface SidebarAddUserType {
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

const InputLabel = styled(MuiInputLabel)(({ theme }) => ({
  lineHeight: 1.154,
  maxWidth: 'max-content',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize
}))

const defaultValues: UserFormData = {
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  confirm_password: '',
  permissions: []
}

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, mode, id } = props

  // ** React Query Client
  const queryClient = useQueryClient()

  // ** Fetch User data using React Queries (only when in edit mode)
  const { data, refetch } = useQuery({
    queryKey: ['fetchUserById', id],
    queryFn: () => fetchUserById(id),
    enabled: !!id && mode === 'edit'
  })
  const { data: permissionsData } = useQuery({ queryKey: ['permissions'], queryFn: fetchPermissions, enabled: open })

  const permissions = useMemo(() => {
    if (permissionsData?.data) {
      return permissionsData.data
    } else {
      return []
    }
  }, [permissionsData?.data])

  // ** State
  const [hidePassword, setHidePassword] = useState<boolean>(false)
  const [hideCfmPassword, setCfmPassword] = useState<boolean>(false)

  const validationSchema = mode === 'edit' ? updateSchema : createSchema

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema)
  })

  // ** Populate the form fields when data is available
  useEffect(() => {
    if (data?.data && mode === 'edit') {
      setValue('id', data.data._id)
      setValue('first_name', data.data.first_name)
      setValue('last_name', data.data.last_name)
      setValue('email', data.data.email)
      setValue('phone', data.data.phone)

      // Set selected permissions
      setValue(
        'permissions',
        data.data.permissions.map((perm: any) => perm.permission_id)
      )
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
    mutationKey: ['updateUser'],
    mutationFn: updateUser,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchUsers'] })
    }
  })

  // ** Mutation for storing new user
  const storeMutator = useMutation({
    mutationKey: ['storeUser'],
    mutationFn: storeUser,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchUsers'] })
    }
  })

  // ** Form submission handler
  const onSubmit = async (formData: UserFormData) => {
    console.log('Submitted Form Data', formData)

    try {
      // Get the ID for the 'all:manage' permission dynamically
      const allManagePermission = permissions.find((permission: any) => permission.permissionKey === 'all:manage')
      const allManageId = allManagePermission ? allManagePermission._id : null

      if (allManageId && formData.permissions.includes(allManageId)) {
        // If 'all:manage' permission is selected, modify formData to only include 'all:manage' permission ID
        formData.permissions = [allManageId]
      }

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
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>{props.mode === 'add' ? 'Add Manager' : 'Edit Manager'}</Typography>
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
          <Controller
            name='first_name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='First Name'
                onChange={onChange}
                placeholder='John Doe'
                error={Boolean(errors.first_name)}
                {...(errors.first_name && { helperText: errors.first_name.message })}
              />
            )}
          />
          <Controller
            name='last_name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Last Name'
                onChange={onChange}
                placeholder='John Doe'
                error={Boolean(errors.last_name)}
                {...(errors.last_name && { helperText: errors.last_name.message })}
              />
            )}
          />

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
          <Controller
            name='phone'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CleaveWrapper>
                <InputLabel htmlFor='phone-number'>Phone Number</InputLabel>
                {/* @ts-ignore */}
                <Cleave
                  id='phone-number'
                  placeholder='1 234 567 8900'
                  options={{ phone: true, phoneRegionCode: 'US' }}
                  value={value}
                  onChange={onChange}
                />
              </CleaveWrapper>
            )}
          />

          {props.mode === 'add' ? (
            <>
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
                            <Icon fontSize='1.25rem' icon={hidePassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(errors.confirm_password)}
                    {...(errors.confirm_password && { helperText: errors.confirm_password.message })}
                  />
                )}
              />
            </>
          ) : (
            <></>
          )}

          <Controller
            name='permissions'
            control={control}
            rules={{ required: 'Please select at least one permission' }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <CustomCheckboxField
                label='Set Permission'
                permissions={permissions}
                value={value || []}
                onChange={onChange}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              {mode === 'add' ? 'Add' : 'Update'}
            </Button>
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser
