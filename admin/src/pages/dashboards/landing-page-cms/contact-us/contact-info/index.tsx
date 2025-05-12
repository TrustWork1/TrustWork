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
import { fetchAppInfoCmsList, updateAppInfoCmsList } from 'src/services/functions/home-cms.api'
import { appInfoValidationSchema, AppInfoValidationSchemaType } from 'src/validation/homeCms.validation'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import toast from 'react-hot-toast'
import { IContactCmsModel } from '@/type/apps/contactCmsTypes'
import { contactInfoValidationSchema, ContactInfoValidationSchemaType } from 'src/validation/contactCms.validation'
import { fetchContactInfoCmsList, updateContactInfoCmsList } from 'src/services/functions/contact-cms.api'

const ContactInfoContent = () => {
  const { data, isLoading, refetch } = useQuery({
    refetchOnMount: false,
    queryKey: [listOfUniqueKeys.home.appInfo.list],
    queryFn: fetchContactInfoCmsList,
    retry: false
  })
  const cmsData: IContactCmsModel['ContactInfoContent'] | undefined = useMemo(() => {
    return data?.data ?? undefined
  }, [data?.data])

  console.log('cmsData', { cmsData })

  const initialDatas = {
    section_header: '',
    section_description: '',
    title: '',
    description: '',
    call_center_number: '',
    email: '',
    location: '',
    facebook_url: '',
    x_url: '',
    linkedin_url: '',
    youtube_url: '',
    map_url: '',
    longitude: '',
    latitude: '',
    get_in_touch_title: '',
    get_in_touch_description: '',
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm<ContactInfoValidationSchemaType>({
    defaultValues: initialDatas,
    resolver: yupResolver(contactInfoValidationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    reset({
        section_header: cmsData?.section_header || '',
        section_description: cmsData?.section_description || '',
        title: cmsData?.title || '',
        description: cmsData?.description || '',
        call_center_number: cmsData?.call_center_number || '',
        email: cmsData?.email || '',
        location: cmsData?.location || '',
        facebook_url: cmsData?.facebook_url || '',
        x_url: cmsData?.x_url || '',
        linkedin_url: cmsData?.linkedin_url || '',
        youtube_url: cmsData?.youtube_url || '',
        map_url: cmsData?.map_url || '',
        longitude: cmsData?.longitude || '',
        latitude: cmsData?.latitude || '',
        get_in_touch_title: cmsData?.get_in_touch_title || '',
        get_in_touch_description: cmsData?.get_in_touch_description || '',
    })

  }, [data?.data])

  const { mutate, isPending } = useMutation({
    mutationFn: updateContactInfoCmsList,
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

  const onSubmit = (data: ContactInfoValidationSchemaType) => {
    const formData = new FormData()
    formData.append('section_header', data.section_header)
    formData.append('section_description', data.section_description)
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('call_center_number', data.call_center_number)
    formData.append('email', data.email)
    formData.append('location', data.location)
    formData.append('facebook_url', data.facebook_url)
    formData.append('x_url', data.x_url)
    formData.append('linkedin_url', data.linkedin_url)
    formData.append('youtube_url', data.youtube_url)
    formData.append('map_url', data.map_url)
    formData.append('longitude', data.longitude)
    formData.append('latitude', data.latitude)
    formData.append('get_in_touch_title', data.get_in_touch_title)
    formData.append('get_in_touch_description', data.get_in_touch_description)

    mutate(formData)
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage Contact Info' className='secondaryDesign' />
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

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='call_center_number'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Call Center Number'
                          {...field}
                          error={!!errors.call_center_number}
                          helperText={errors.call_center_number?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='email'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Email'
                          {...field}
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='location'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Location'
                          {...field}
                          error={!!errors.location}
                          helperText={errors.location?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='facebook_url'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Facebook URL'
                          {...field}
                          error={!!errors.facebook_url}
                          helperText={errors.facebook_url?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='x_url'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='X-Portal URL'
                          {...field}
                          error={!!errors.x_url}
                          helperText={errors.x_url?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='linkedin_url'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='LinkedIn URL'
                          {...field}
                          error={!!errors.linkedin_url}
                          helperText={errors.linkedin_url?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='youtube_url'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Youtube URL'
                          {...field}
                          error={!!errors.youtube_url}
                          helperText={errors.youtube_url?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name='map_url'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Google Map URL'
                          {...field}
                          error={!!errors.map_url}
                          helperText={errors.map_url?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='longitude'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Longitude'
                          {...field}
                          error={!!errors.longitude}
                          helperText={errors.longitude?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='latitude'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Latitude'
                          {...field}
                          error={!!errors.latitude}
                          helperText={errors.latitude?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name='get_in_touch_title'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Get In Touch Title'
                          {...field}
                          error={!!errors.get_in_touch_title}
                          helperText={errors.get_in_touch_title?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name='get_in_touch_description'
                      control={control}
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label='Get In Touch Description'
                          {...field}
                          error={!!errors.get_in_touch_description}
                          helperText={errors.get_in_touch_description?.message}
                        />
                      )}
                    />
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

export default ContactInfoContent
