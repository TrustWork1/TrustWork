// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { adminDetailChangePasswordFn } from 'src/services/functions/admin.api'
import { globalSuccess } from 'src/lib/functions/_helpers.lib'
import { changePasswordSchema } from 'src/validation/changePassword.validation'
import { TAdminChangePasswordParamType } from 'src/types/apps/admin'

interface State {
  showNewPassword: boolean
  showCurrentPassword: boolean
  showConfirmNewPassword: boolean
}

const defaultValues: TAdminChangePasswordParamType = {
  new_password: '',
  current_password: '',
  confirm_password: ''
}

const ChangePasswordCard = () => {
  // ** States
  const [values, setValues] = useState<State>({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<TAdminChangePasswordParamType>({ resolver: yupResolver(changePasswordSchema) })

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const updateChangePasswordMutator = useMutation({
    mutationKey: ['adminDetailChangePasswordFn'],
    mutationFn: adminDetailChangePasswordFn,
    onSuccess: response => {
      globalSuccess(response?.message)
      reset(defaultValues)
    }
  })

  const onPasswordFormSubmit = (data: TAdminChangePasswordParamType) => {
    console.log(data, 'data')
    updateChangePasswordMutator.mutateAsync(data)

    // toast.success('Password Changed Successfully')
    //
  }

  return (
    <Card>
      <CardHeader title='Change Password' />
      <CardContent>
        <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='current_password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Current Password'
                    placeholder='············'
                    id='input-current-password'
                    error={Boolean(errors.current_password)}
                    type={values.showCurrentPassword ? 'text' : 'password'}
                    {...(errors.current_password && { helperText: errors.current_password.message as string })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={handleClickShowCurrentPassword}
                          >
                            <Icon
                              fontSize='1.25rem'
                              icon={values.showCurrentPassword ? 'tabler:eye-off' : 'tabler:eye'}
                            />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={5} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='new_password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='New Password'
                    id='input-new-password'
                    placeholder='············'
                    error={Boolean(errors.new_password)}
                    type={values.showNewPassword ? 'text' : 'password'}
                    {...(errors.new_password && { helperText: errors.new_password.message as string })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <Icon fontSize='1.25rem' icon={values.showNewPassword ? 'tabler:eye-off' : 'tabler:eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='confirm_password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder='············'
                    label='Confirm New Password'
                    id='input-confirm-new-password'
                    error={Boolean(errors.confirm_password)}
                    type={values.showConfirmNewPassword ? 'text' : 'password'}
                    {...(errors.confirm_password && { helperText: errors.confirm_password.message as string })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={handleClickShowConfirmNewPassword}
                          >
                            <Icon
                              fontSize='1.25rem'
                              icon={values.showConfirmNewPassword ? 'tabler:eye-off' : 'tabler:eye'}
                            />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Password Requirements:</Typography>
              <Box component='ul' sx={{ pl: 6, mb: 0, '& li': { mb: 1.5, color: 'text.secondary' } }}>
                <li>Minimum 8 characters long - the more, the better</li>
                <li>At least one lowercase & one uppercase character</li>
                <li>At least one number, symbol, or special character</li>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' type='submit' sx={{ mr: 4 }}>
                Save Changes
              </Button>
              <Button type='reset' variant='tonal' color='secondary' onClick={() => reset()}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordCard
