// ** React Imports
import { IHomeCmsModel } from '@/type/apps/homeCmsTypes'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, CardContent, TextField } from '@mui/material'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CustomDropzone from 'src/@core/components/react-drop-zone'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import LoadingComp from 'src/pages/components/LoadingComp/LoadingComp'
import { fetchHowItWorksCmsContent, updateHowItWorksCmsContent } from 'src/services/functions/home-cms.api'
import {
  howItWorksContentValidationSchema,
  HowItWorksContentValidationSchemaType
} from 'src/validation/homeCms.validation'

const HowItWorksContents = () => {
  const [videoPreview, setVideoPreview] = useState<string | undefined>(undefined)
  const { data, isLoading, refetch } = useQuery({
    refetchOnMount: false,
    queryKey: [listOfUniqueKeys.home.howItworks.contentFetch],
    queryFn: fetchHowItWorksCmsContent,
    retry: false
  })
  const cmsData: IHomeCmsModel['HowItWorksContent'] | undefined = useMemo(() => {
    return data?.data ?? undefined
  }, [data?.data])

  const initialDatas = {
    header: '',
    description: '',
    video: undefined
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm<HowItWorksContentValidationSchemaType>({
    defaultValues: initialDatas,
    resolver: yupResolver(howItWorksContentValidationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    reset({
      header: cmsData?.header || '',
      description: cmsData?.description || '',
      video: cmsData?.media || undefined
    })
    setVideoPreview(cmsData?.media ?? undefined)
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

  const onSubmit = (data: HowItWorksContentValidationSchemaType) => {
    const formData = new FormData()
    formData.append('header', data.header)
    formData.append('description', data.description)
    if (data.video && typeof data.video !== 'string') {
      formData.append('media', data.video as File)
    }
    mutate(formData)
  }

  const handleDrop = (file: File) => {
    setVideoPreview(URL.createObjectURL(file))
    setValue('video', file as any)
    clearErrors('video')
  }
  const onVideoDelete = () => {
    setVideoPreview(undefined)
    setValue('video', undefined as any)
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
                      name='header'
                      control={control}
                      render={({ field }: { field: { value: string } }) => (
                        <TextField
                          fullWidth
                          label='header'
                          {...field}
                          error={!!errors.header}
                          helperText={errors.header?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field }: { field: { value: string } }) => (
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
                      Upload Video
                    </Typography>
                    <CustomDropzone
                      onDrop={handleDrop}
                      accept={['video/mp4', 'video/webm', 'video/ogg']}
                      maxSize={50000000} // 50MB
                      errorMessage='Invalid file type. Please upload a video (MP4, WEBM, OGG) only.'
                      preview={videoPreview}
                      onDelete={onVideoDelete}
                      fileType='video'
                    />
                    {!!errors?.video && <Typography color='error'>{errors?.video?.message}</Typography>}
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

export default HowItWorksContents
