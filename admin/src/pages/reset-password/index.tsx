// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { resetPasswordSchema } from 'src/validation/resetPassword.validation'

// ** Styled Components
const ResetPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: `${theme.palette.primary.main} !important`
}))

interface FormData {
  new_password: string
  confirm_password: string
}

interface ForgotPasswordResponse {
  status: number
}

const ResetPassword = () => {
  // ** Hooks
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const auth = useAuth()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(resetPasswordSchema)
  })

  useEffect(() => {
    const { email: emailParam, token: tokenParam } = router.query
    if (typeof emailParam === 'string') setEmail(emailParam)
    if (typeof tokenParam === 'string') setToken(tokenParam)
  }, [router.query])

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', { ...data, email, token })

    auth.resetPassword({ ...data, email, token }, (response: any) => {
      console.log('Resetting password response:', response)
      const typedResponse = response as ForgotPasswordResponse
      console.log('Forgot Password response', typedResponse)
      if (typedResponse.status === 200) {
        toast.success('Reset password successfully to your email!')
      } else {
        setError('new_password', { type: 'manual', message: 'Password is invalid' })
        setError('confirm_password', { type: 'manual', message: 'Confirm password is invalid' })

        // toast.error('There was an error sending the reset link.')
      }
    })
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <ResetPasswordIllustration
            alt='reset-password-illustration'
            src={`/images/pages/auth-v2-reset-password-illustration-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Image src='/images/logos/logo.svg' alt='Logo' width={50} height={35} />
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Reset Password 🔒
              </Typography>
              <Typography sx={{ display: 'flex' }}>
                for{' '}
                <Typography component='span' sx={{ ml: 1, fontWeight: 500 }}>
                  {email}
                </Typography>
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name='new_password'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    autoFocus
                    label='New Password'
                    placeholder='············'
                    sx={{ display: 'flex', mb: 4 }}
                    id='auth-reset-password-v2-new-password'
                    type={showNewPassword ? 'text' : 'password'}
                    error={Boolean(errors.new_password)}
                    helperText={errors.new_password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <Icon fontSize='1.25rem' icon={showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Controller
                name='confirm_password'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Confirm Password'
                    placeholder='············'
                    sx={{ display: 'flex', mb: 4 }}
                    id='auth-reset-password-v2-confirm-password'
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    error={Boolean(errors.confirm_password)}
                    helperText={errors.confirm_password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          >
                            <Icon fontSize='1.25rem' icon={showConfirmNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                Set New Password
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
ResetPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ResetPassword.guestGuard = true

export default ResetPassword
