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
import { fetchHowItWorksCmsContent, updateAppInfoCmsList, updateHowItWorksCmsContent } from 'src/services/functions/home-cms.api'
import { howItWorksContentValidationSchema, HowItWorksContentValidationSchemaType } from 'src/validation/homeCms.validation'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import toast from 'react-hot-toast'
import { IAboutCmsModel } from '@/type/apps/aboutCmsTypes'
import { WhyTrsutUsValidationSchemaType, whyTrustUsValidationSchema } from 'src/validation/aboutCms.validation'
import { fetchWhyTrustUsCmsList } from 'src/services/functions/about-cms.api'

const WhyTrustUsContents = () => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)
  const [imageSectionPreview, setImageSectionPreview] = useState<string | undefined>(undefined)
  const { data, isLoading, refetch } = useQuery({
    refetchOnMount: false,
    queryKey: [listOfUniqueKeys.aboutUs.whyTrustUs.contentFetch],
    queryFn: fetchWhyTrustUsCmsList,
    retry: false
  })
  const cmsData: IAboutCmsModel['WhyTrustUsContent'] | undefined = useMemo(() => {
    return data?.data ?? undefined
  }, [data?.data])

  console.log('cmsData', { cmsData })

  const initialDatas = {
    section_header: '',
    section_description: '',
    mission_title: '',
    mission_description: '',
    vision_title: '',
    vision_description: '',
    image: undefined,
    section_image: undefined,
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm<WhyTrsutUsValidationSchemaType>({
    defaultValues: initialDatas,
    resolver: yupResolver(whyTrustUsValidationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    reset({
      section_header: cmsData?.section_header || '',
      section_description: cmsData?.section_description || '',
      mission_title: cmsData?.mission_title || '',
      mission_description: cmsData?.mission_description || '',
      vision_title: cmsData?.vision_title || '',
      vision_description: cmsData?.vision_description || '',
      image: cmsData?.image || undefined,
      section_image: cmsData?.section_image || undefined
    })
    setImagePreview(cmsData?.image ?? undefined)
    setImageSectionPreview(cmsData?.section_image ?? undefined)
  }, [data?.data])

  const { mutate, isPending } = useMutation({
    mutationFn: updateHowItWorksCmsContent,
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

  const onSubmit = (data: WhyTrsutUsValidationSchemaType) => {
    const formData = new FormData()
    formData.append('section_header', data.section_header)
    formData.append('section_description', data.section_description)
    formData.append('mission_title', data.mission_title)
    formData.append('mission_description', data.mission_description)
    formData.append('vision_title', data.vision_title)
    formData.append('vision_description', data.vision_description)
    if (data.image && typeof data.image !== 'string') {
      formData.append('image', data.image as File)
    }
    if (data.section_image && typeof data.section_image !== 'string') {
      formData.append('section_image', data.section_image as File)
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

  const handleDropSectionImage = (file: File) => {
    setImageSectionPreview(URL.createObjectURL(file))
    setValue('section_image', file as any)
    clearErrors('section_image')
  }
  const onDeleteSectionImage = () => {
    setImageSectionPreview(undefined)
    setValue('section_image', undefined as any)
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage Content' className='secondaryDesign' />
          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            {isLoading ? (
              <LoadingComp />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Controller
                      name='section_header'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Section Header'
                          {...field}
                          error={!!errors.section_header}
                          helperText={errors.section_header?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name='section_description'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label='Section Description'
                          {...field}
                          error={!!errors.section_description}
                          helperText={errors.section_description?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant='subtitle2' sx={{ mb: 1 }}>
                      Upload Why Trust Us Section Image
                    </Typography>
                    <CustomDropzone
                      onDrop={handleDropSectionImage}
                      accept={['image/jpeg', 'image/png']}
                      maxSize={5000000} // 5MB
                      errorMessage='Invalid file type. Please upload an image (JPG, JPEG, PNG) only.'
                      preview={imageSectionPreview}
                      onDelete={onDeleteSectionImage}
                    />
                    {!!errors?.section_image && <Typography color='error'>{errors?.section_image?.message}</Typography>}
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name='mission_title'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Mission Title'
                          {...field}
                          error={!!errors.mission_title}
                          helperText={errors.mission_title?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name='mission_description'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label='Mission Description'
                          {...field}
                          error={!!errors.mission_description}
                          helperText={errors.mission_description?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name='vision_title'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Vision Title'
                          {...field}
                          error={!!errors.vision_title}
                          helperText={errors.vision_title?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name='vision_description'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label='Vision Description'
                          {...field}
                          error={!!errors.vision_description}
                          helperText={errors.vision_description?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant='subtitle2' sx={{ mb: 1 }}>
                      Upload Mission Section Image
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

export default WhyTrustUsContents
