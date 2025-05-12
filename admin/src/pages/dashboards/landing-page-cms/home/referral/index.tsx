// ** React Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { IHomeCmsModel } from '@/type/apps/homeCmsTypes'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, CardContent, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import CustomDropzone from 'src/@core/components/react-drop-zone'
import LoadingComp from 'src/pages/components/LoadingComp/LoadingComp'
import { fetchReferralCmsContent, updateReferralCmsContent } from 'src/services/functions/home-cms.api'
import { referralContentValidationSchema, ReferralContentValidationSchemaType } from 'src/validation/homeCms.validation'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import toast from 'react-hot-toast'

const ReferralSection = () => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)
  const { data, isLoading, refetch } = useQuery({
    refetchOnMount: false,
    queryKey: [listOfUniqueKeys.home.referral.contentFetch],
    queryFn: fetchReferralCmsContent,
    retry: false
  })
  const cmsData: IHomeCmsModel['ReferralContentData'] | undefined = useMemo(() => {
    return data?.data ?? undefined
  }, [data?.data])

  console.log('cmsData', { cmsData })

  const initialDatas = {
    title: '',
    description: '',
    button_link: '',
    button_title: '',
    image: undefined
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm<ReferralContentValidationSchemaType>({
    defaultValues: initialDatas,
    resolver: yupResolver(referralContentValidationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    reset({
      title: cmsData?.title || '',
      description: cmsData?.description || '',
      button_link: cmsData?.button_link || '',
      button_title: cmsData?.button_title || '',
      image: cmsData?.image || undefined
    })
    setImagePreview(cmsData?.image ?? undefined)
  }, [data?.data])

  const { mutate, isPending } = useMutation({
    mutationFn: updateReferralCmsContent,
    onSuccess: res => {
      if (String(res.status) === '200') {
        toast.success(res.message)
        refetch()
      }
    },
    onError: error => {
      toast.error(`Failed to update app information: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

  const onSubmit = (data: ReferralContentValidationSchemaType) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('button_title', data.button_title)
    formData.append('button_link', data.button_link)
    if (data.image && typeof data.image !== 'string') {
      formData.append('image', data.image as File)
    }
    mutate(formData)
  }

  const handleDrop = (file: File) => {
    setImagePreview(URL.createObjectURL(file))
    setValue('image', file as any)
    clearErrors('image')
  }
  const onDelete = () => {
    setImagePreview(undefined)
    setValue('image', undefined as any)
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage Referral Section' className='secondaryDesign' />
          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            {isLoading ? (
              <LoadingComp />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Controller
                      name='title'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Title'
                          {...field}
                          error={!!errors.title}
                          helperText={errors.title?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label='Description'
                          {...field}
                          error={!!errors.description}
                          helperText={errors.description?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='button_title'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Button Title'
                          {...field}
                          error={!!errors.button_title}
                          helperText={errors.button_title?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='button_link'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Button Link'
                          {...field}
                          error={!!errors.button_link}
                          helperText={errors.button_link?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant='subtitle2' sx={{ mb: 1 }}>
                      Upload Image
                    </Typography>
                    <CustomDropzone
                      onDrop={handleDrop}
                      accept={['image/jpeg', 'image/png']}
                      maxSize={5000000} // 5MB
                      errorMessage='Invalid file type. Please upload an image (JPG, JPEG, PNG) only.'
                      preview={imagePreview}
                      onDelete={onDelete}
                    />
                    {!!errors?.image && <Typography color='error'>{errors?.image?.message}</Typography>}
                  </Grid>

                  <Grid item xs={12}>
                    <Button type='submit' variant='contained' disableRipple disabled={isPending}>
                      {isPending ? 'Loading...' : 'Save'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ReferralSection
