/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable lines-around-comment */
// ** React Imports
import { ChangeEvent, ElementType, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import { Grid, TextField } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** YUP Validation Imports

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** library Imports
import Image from 'next/image'
import { IMAGE_ACCEPT } from 'src/configs/constant'
import { globalSuccess } from 'src/lib/functions/_helpers.lib'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import { saveAppFeaturesCmsList, updateAppFeaturesCmsList } from 'src/services/functions/home-cms.api'
import CustomButtonPrimary from 'src/ui/Icons/CustomButtons/CustomButtonPrimary'
import {
  appFeatureCreateValidationSchema,
  appFeatureUpdateValidationSchema
} from 'src/validation/home-app-feature.validation'
import { RowData } from 'src/pages/dashboards/app-referral-content/list'
import { IMAGE_BASE_URL } from 'src/configs/landing-website/home/app-referrals'
import { saveAppReferralCmsList, updateAppReferralCmsList } from 'src/services/functions/app-referral.api'
import {
  appReferralCreateValidationSchema,
  appReferralUpdateValidationSchema
} from 'src/validation/app-referral-content.validation'

// ** Types Imports

interface SidebarAddEditType {
  open: boolean
  toggle: () => void
  mode: 'add' | 'edit'
  id: null | number | string
  fullRowDetails: RowData | undefined
}

interface TCategory {
  content: string
  imageUrl: string
  image?: Blob
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const defaultValues: TCategory = {
  content: '',
  imageUrl: '',
  image: undefined
}

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const AddEditDrawerContent = (props: SidebarAddEditType) => {
  const [uploadProfileImage, setUploadProfileImage] = useState<Blob | null>(null)

  // ** Props
  const { open, toggle, mode, id } = props

  const validationSchema = mode === 'edit' ? appReferralUpdateValidationSchema : appReferralCreateValidationSchema

  const {
    reset,
    control,
    setValue,
    getValues,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema())
  })

  console.log('errors', { errors })

  // ** React Query Client
  const queryClient = useQueryClient()

  // ** Populate the form fields when data is available
  useEffect(() => {
    if (props.fullRowDetails && mode === 'edit') {
      // setValue('feature_title', props.fullRowDetails.title)
      setValue('content', props.fullRowDetails.content)
      setValue('imageUrl', props.fullRowDetails?.icon)
    } else if (mode === 'add') {
      reset(defaultValues)
    }
  }, [props.fullRowDetails, setValue, mode, reset, open])

  console.log(getValues(), 'getValues()')

  // ** Mutation for updating feature
  const updateMutator = useMutation({
    mutationKey: [listOfUniqueKeys.home.appReferrals.update, id],
    mutationFn: (formData: FormData) => updateAppReferralCmsList(id as string, formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: [listOfUniqueKeys.home.appReferrals.list] })
    }
  })

  // ** Mutation for storing new feature
  const storeMutator = useMutation({
    mutationKey: [[listOfUniqueKeys.home.appReferrals.save]],
    mutationFn: (formData: FormData) => saveAppReferralCmsList(formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: [listOfUniqueKeys.home.appReferrals.list] })
    }
  })

  console.log(errors, 'errors')

  // ** Form submission handler
  const onSubmit = async (data: TCategory) => {
    console.log(data, 'data')
    try {
      if (mode === 'edit') {
        const formData = new FormData()
        // formData?.append('title', data?.feature_title)
        formData?.append('content', data?.content)
        data?.image && formData?.append('icon', data?.image)

        await updateMutator.mutateAsync(formData)
      } else {
        const formData = new FormData()
        formData?.append('content', data?.content)
        data?.image && formData?.append('icon', data?.image)
        await storeMutator.mutateAsync(formData)
      }

      // Reset form and close modal (or whatever you need to do after submission)
      toggle()
      reset()
      setUploadProfileImage(null)
    } catch (e) {
      console.error('Error saving data', e)
    }
  }

  const clearFileInput = () => {
    const fileInput = document.getElementById('account-settings-upload-image') as HTMLInputElement

    if (fileInput) {
      // Reset the file input value
      fileInput.value = ''

      // Reset the form state
      setUploadProfileImage(null)
      setValue('image', undefined)
    }
  }

  const handleClose = () => {
    toggle()
    reset()
    setUploadProfileImage(null)
    clearFileInput()
  }

  const handleProfileImageFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event?.target?.files?.[0]
      console.log('file', { file })
      if (file) {
        setValue('image', file)
        setError('image', { message: '' })
        setUploadProfileImage(file)
      }
    },
    [setError, setValue]
  )

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
        <Typography variant='h5'>{props.mode === 'add' ? 'Add ' : 'Edit '}Content</Typography>
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
          {/* Plan benefits */}
          <Grid item md={12} sx={{ px: 3, mb: 3 }}>
            <label className='project_title'>Description*</label>

            <Controller
              name='content'
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
                  placeholder='Enter the description'
                  error={Boolean(errors.content)}
                  {...(errors.content && { helperText: errors.content.message })}
                />
              )}
            />
          </Grid>

          <Grid item md={12} sx={{ px: 3, mb: 3 }}>
            <Box className='profile_img'>
              <figure>
                {uploadProfileImage === null ? (
                  props.fullRowDetails?.icon ? (
                    <Image
                      src={`${IMAGE_BASE_URL}${props.fullRowDetails?.icon}`}
                      alt={`${props.fullRowDetails?.icon}`}
                      width={150}
                      height={150}
                    />
                  ) : (
                    <Image
                      src='/assets/images/no-image.png'
                      alt='/assets/images/no-image.png'
                      width={150}
                      height={150}
                    />
                  )
                ) : (
                  <Image
                    src={URL?.createObjectURL(uploadProfileImage)}
                    alt={uploadProfileImage?.name as string}
                    width={162}
                    height={165}
                    // loading='lazy'
                    // placeholder='blur'
                    // blurDataURL={assest?.blurImageSkelton}
                    // onError={handleUploadProfileImageError}
                  />
                )}
              </figure>

              <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                Upload Image
                <input
                  hidden
                  type='file'
                  accept={IMAGE_ACCEPT}
                  onChange={handleProfileImageFile}
                  id='account-settings-upload-image'
                />
              </ButtonStyled>

              {/* Upload Image */}

              {/* <Typography variant='body1'> (Max. File size: 5 mb)</Typography> */}
              {errors?.image ? (
                <Typography variant='body1' className='imgError'>
                  {errors?.image?.message as string}
                </Typography>
              ) : null}
            </Box>
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

export default AddEditDrawerContent
