// ** React Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, CardContent, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import CustomDropzone from 'src/@core/components/react-drop-zone'
import LoadingComp from 'src/pages/components/LoadingComp/LoadingComp'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import { aboutInfoValidationSchema, AboutInfoValidationSchemaType } from 'src/validation/aboutCms.validation'
import toast from 'react-hot-toast'
import { IAboutCmsModel } from '@/type/apps/aboutCmsTypes'
import { fetchAboutInfoCmsList, updateAboutInfoCmsList } from 'src/services/functions/about-cms.api'

const AboutInfoContent = () => {
  const [imageOnePreview, setImageOnePreview] = useState<string | undefined>(undefined)
  const [imageTwoPreview, setImageTwoPreview] = useState<string | undefined>(undefined)
  const { data, isLoading, refetch } = useQuery({
    refetchOnMount: false,
    queryKey: [listOfUniqueKeys.aboutUs.aboutInfo],
    queryFn: fetchAboutInfoCmsList,
    retry: false
  })
  const cmsData: IAboutCmsModel['AboutInfoContent'] | undefined = useMemo(() => {
    return data?.data ?? undefined
  }, [data?.data])

  console.log('cmsData', { cmsData })

  const initialDatas = {
    title: '',
    section_header: '',
    section_description: '',
    description: '',
    image1: undefined,
    image2: undefined
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm<AboutInfoValidationSchemaType>({
    defaultValues: initialDatas,
    resolver: yupResolver(aboutInfoValidationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    reset({
        section_header: cmsData?.section_header || '',
        section_description: cmsData?.section_description || '',
        title: cmsData?.title || '',
        description: cmsData?.description || '',
        image1: cmsData?.image1 || undefined,
        image2: cmsData?.image2 || undefined
    })
    setImageOnePreview(cmsData?.image1 ?? undefined)
    setImageTwoPreview(cmsData?.image2 ?? undefined)
  }, [data?.data])

  const { mutate, isPending } = useMutation({
    mutationFn: updateAboutInfoCmsList,
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

  const onSubmit = (data: AboutInfoValidationSchemaType) => {
    const formData = new FormData()
    formData.append('section_header', data.section_header)
    formData.append('section_description', data.section_description)
    formData.append('title', data.title)
    formData.append('description', data.description)
    if (data.image1 && typeof data.image1 !== 'string') {
      formData.append('image1', data.image1 as File)
    }
    if (data.image2 && typeof data.image2 !== 'string') {
      formData.append('image2', data.image2 as File)
    }
    mutate(formData)
  }

  const handleDropImageOne = (file: File) => {
    setImageOnePreview(URL.createObjectURL(file))
    setValue('image1', file as any)
    clearErrors('image1')
  }
  const onDeleteImageOne = () => {
    setImageOnePreview(undefined)
    setValue('image1', undefined as any)
  }

  const handleDropImageTwo = (file: File) => {
    setImageTwoPreview(URL.createObjectURL(file))
    setValue('image2', file as any)
    clearErrors('image2')
  }
  const onDeleteImageTwo = () => {
    setImageTwoPreview(undefined)
    setValue('image2', undefined as any)
  }


  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage About Us Content' className='secondaryDesign' />
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

                  <Grid item xs={12}>
                    <Typography variant='subtitle2' sx={{ mb: 1 }}>
                      Upload Large Image
                    </Typography>
                    <CustomDropzone
                      onDrop={handleDropImageOne}
                      accept={['image/jpeg', 'image/png']}
                      maxSize={5000000} // 5MB
                      errorMessage='Invalid file type. Please upload an image (JPG, JPEG, PNG) only.'
                      preview={imageOnePreview}
                      onDelete={onDeleteImageOne}
                    />
                    {!!errors?.image1 && <Typography color='error'>{errors?.image1?.message}</Typography>}
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant='subtitle2' sx={{ mb: 1 }}>
                      Upload Small Image
                    </Typography>
                    <CustomDropzone
                      onDrop={handleDropImageTwo}
                      accept={['image/jpeg', 'image/png']}
                      maxSize={5000000} // 5MB
                      errorMessage='Invalid file type. Please upload an image (JPG, JPEG, PNG) only.'
                      preview={imageTwoPreview}
                      onDelete={onDeleteImageTwo}
                    />
                    {!!errors?.image2 && <Typography color='error'>{errors?.image2?.message}</Typography>}
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

export default AboutInfoContent
