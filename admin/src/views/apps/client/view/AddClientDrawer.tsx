// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types Imports
import { InputAdornment } from '@mui/material'
import { craeteUserSchema } from 'src/validation/user.validation'
import { useMutation } from '@tanstack/react-query'
import { storeClient } from 'src/services/functions/client.api'

interface SidebarAddClientType {
  open: boolean
  toggle: () => void
}

interface UserData {
  email: string
  name: string
  country: string
  password: string
  confirmPassword: string
  contactPerson: string
  contactPersonPhone: string
  state: string
  address: string
  houseNo: string
  phoneNumber: number
  branch: string
  city: string
  landmark: string
  zipCode: number
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const defaultValues: UserData = {
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
  country: '',
  phoneNumber: Number(''), // Default empty string
  branch: '',
  contactPerson: '',
  contactPersonPhone: '',
  address: '',
  houseNo: '',
  city: '',
  state: '',
  landmark: '',
  zipCode: Number('') // Default empty string
}

const SidebarAddClient = (props: SidebarAddClientType) => {
  // ** Props
  const { open, toggle } = props

  // ** State
  const [hidePassword, setHidePassword] = useState<boolean>(false)
  const [hideCfmPassword, setCfmPassword] = useState<boolean>(false)

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(craeteUserSchema)
  })

  const addClientMutator = useMutation({
    mutationKey: ['storeClient'],
    mutationFn: storeClient
  })

  console.log(errors)
  const onSubmit = async (data: UserData) => {
    console.log(data, 'submitted  Data')

    try {
      const client = await addClientMutator.mutateAsync(data)
      console.log('Client added successfully', client)
      toggle()
      reset()
    } catch (e) {
      console.log('Error adding client', e)
    }
  }

  const handleClose = () => {
    setValue('phoneNumber', Number(''))
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
        <Typography variant='h5'>Add User</Typography>
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
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Name'
                onChange={onChange}
                placeholder='John Doe'
                error={Boolean(errors.name)}
                {...(errors.name && { helperText: errors.name.message })}
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
            name='confirmPassword'
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
                error={Boolean(errors.confirmPassword)}
                {...(errors.confirmPassword && { helperText: errors.confirmPassword.message })}
              />
            )}
          />
          <Controller
            name='branch'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                sx={{ mb: 4 }}
                label='Branch'
                id='validation-billing-select'
                error={Boolean(errors.branch)}
                {...(errors.branch && { helperText: errors.branch.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value=''>Billing</MenuItem>
                <MenuItem value='Auto Debit'>Auto Debit</MenuItem>
                <MenuItem value='Manual - Cash'>Manual - Cash</MenuItem>
                <MenuItem value='Manual - Paypal'>Manual - Paypal</MenuItem>
                <MenuItem value='Manual - Credit Card'>Manual - Credit Card</MenuItem>
              </CustomTextField>
            )}
          />
          <Controller
            name='phoneNumber'
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
                error={Boolean(errors.phoneNumber)}
                {...(errors.phoneNumber && { helperText: errors.phoneNumber.message })}
              />
            )}
          />
          <Controller
            name='contactPerson'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Contact Person'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.password)}
                placeholder='name'
                {...(errors.password && { helperText: errors.password.message })}
              />
            )}
          />
          <Controller
            name='contactPersonPhone'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='tel'
                value={value}
                sx={{ mb: 4 }}
                label='Contact Person Phone'
                onChange={onChange}
                placeholder='(397) 294-5153'
                error={Boolean(errors.contactPersonPhone)}
                {...(errors.contactPersonPhone && { helperText: errors.contactPersonPhone.message })}
              />
            )}
          />
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
                onChange={onChange}
                placeholder='Address'
                error={Boolean(errors.address)}
                {...(errors.address && { helperText: errors.address.message })}
              />
            )}
          />
          <Controller
            name='houseNo'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='House No'
                onChange={onChange}
                placeholder='House number'
                error={Boolean(errors.houseNo)}
                {...(errors.houseNo && { helperText: errors.houseNo.message })}
              />
            )}
          />
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

          <Controller
            name='zipCode'
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
                error={Boolean(errors.zipCode)}
                {...(errors.zipCode && { helperText: errors.zipCode.message })}
              />
            )}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
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

export default SidebarAddClient
