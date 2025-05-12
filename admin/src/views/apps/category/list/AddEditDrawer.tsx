/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable lines-around-comment */
// ** React Imports
import { ChangeEvent, ElementType, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button, { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import { CardContent, Grid, TextField } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** YUP Validation Imports
import { categoryCreateValidationSchema, categoryUpdateValidationSchema } from 'src/validation/category.validation'

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'
import { fetchCategoryById, storeCategory, updateCategory } from 'src/services/functions/category.api'
import { TCategoryAddParam } from 'src/types/apps/category.type'
import { IMAGE_ACCEPT } from 'src/configs/constant'
import Image from 'next/image'
import { File } from 'buffer'
import CustomButtonPrimary from 'src/ui/Icons/CustomButtons/CustomButtonPrimary'
import axios from 'axios'
import { mediaUrl } from 'src/configs/common'

// ** Types Imports

interface SidebarAddEditType {
  open: boolean
  toggle: () => void
  mode: 'add' | 'edit'
  id: null | number | string
}

interface TCategory {
  category_name: string
  category_details: string
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
  category_name: '',
  category_details: '',
  imageUrl: ''
  // image: null
}

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

const SidebarAddEdit = (props: SidebarAddEditType) => {
  const [uploadProfileImage, setUploadProfileImage] = useState<Blob | null>(null)

  // ** Props
  const { open, toggle, mode, id } = props

  const validationSchema = mode === 'edit' ? categoryUpdateValidationSchema : categoryCreateValidationSchema

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

  // ** React Query Client
  const queryClient = useQueryClient()

  // ** Fetch Client data using React Queries (only when in edit mode)
  const { data, refetch } = useQuery({
    queryKey: ['fetchCategoryById', id],
    queryFn: () => fetchCategoryById(id),
    enabled: !!id && mode === 'edit'
  })

  // ================================================================
  // ================================================================

  // ** Populate the form fields when data is available
  useEffect(() => {
    if (data?.data && mode === 'edit') {
      setValue('category_name', data.data.title)
      setValue('category_details', data.data.description)
      setValue('imageUrl', data?.data?.image)
      // axios
      //   .get(mediaUrl(data?.data?.image), {
      //     responseType: 'blob'
      //   })
      //   .then(res => {
      //     console.log(typeof File, 'typeof File')
      //     if (res?.data) {
      //       const blob = res?.data

      //       // Convert the blob to a File
      //       // const file = new File([blob], (res.data as Blob).name, { type: blob.type })
      //       const file = {
      //         name: (blob as Blob).name,
      //         size: blob.size,
      //         type: blob.type,
      //         blob
      //       }
      //       console.log({ res, file }, 'res')
      //       setUploadProfileImage(blob)
      //       setValue('image', file, {
      //         shouldValidate: true
      //       })
      //     }
      //   })
    } else if (mode === 'add') {
      reset(defaultValues)
    }
  }, [data?.data, setValue, mode, reset, open])

  console.log(getValues(), 'getValues()')

  useEffect(() => {
    if (open && id) {
      refetch()
    }
  }, [open, id, refetch])

  // ** Mutation for updating user
  const updateMutator = useMutation({
    mutationKey: ['updateCategory', id],
    mutationFn: (formData: FormData) => updateCategory(id as string, formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchCategories'] })
    }
  })

  // ** Mutation for storing new user
  const storeMutator = useMutation({
    mutationKey: ['storeCategory'],
    mutationFn: (formData: FormData) => storeCategory(formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchCategories'] })
    }
  })

  console.log(errors, 'errors')

  // ** Form submission handler
  const onSubmit = async (data: TCategory) => {
    console.log(data, 'data')
    try {
      if (mode === 'edit') {
        const formData = new FormData()
        formData?.append('title', data?.category_name)
        formData?.append('description', data?.category_details)
        data?.image && formData?.append('image', data?.image)

        await updateMutator.mutateAsync(formData)
      } else {
        const formData = new FormData()
        formData?.append('title', data?.category_name)
        formData?.append('description', data?.category_details)
        data?.image && formData?.append('image', data?.image)
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

  const handleClose = () => {
    toggle()
    reset()
    setUploadProfileImage(null)
  }

  const handleProfileImageFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event?.target?.files?.[0]
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
        <Typography variant='h5'>{props.mode === 'add' ? 'Add Category' : 'Edit Category'}</Typography>
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
                name='category_name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    className='project_border_none'
                    value={value}
                    onChange={onChange}
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Category Name*'
                    placeholder='Enter the category name'
                    error={Boolean(errors.category_name)}
                    {...(errors.category_name && { helperText: errors.category_name.message })}
                  />
                )}
              />
            </Grid>

            {/* Plan benefits */}
            <Grid item md={12} sx={{ px: 3, mb: 3 }}>
              <label className='project_title'>Category Details*</label>

              <Controller
                name='category_details'
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
                    placeholder='Enter the category benefits'
                    error={Boolean(errors.category_details)}
                    {...(errors.category_details && { helperText: errors.category_details.message })}
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
            {/* <Grid item md={6} sx={{ px: 2 }}>
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
            </Grid> */}

            {/*  */}
          </Grid>

          <Grid item md={12} sx={{ px: 3, mb: 3 }}>
            <Box className='profile_img'>
              <figure>
                {uploadProfileImage === null ? (
                  data?.data?.image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${data?.data?.image}`}
                      // src='/assets/images/no-image.png'
                      alt={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${data?.data?.image}`}
                      width={150}
                      height={150}
                    />
                  ) : (
                    <Image
                      // src={`${process.env.NEXT_PUBLIC_BASE_URL}/profile/${data?.data?.image}`}
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
              {/* <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                Reset
              </ResetButtonStyled> */}

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

export default SidebarAddEdit
