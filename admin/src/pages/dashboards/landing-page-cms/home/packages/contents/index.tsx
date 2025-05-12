// ** React Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { IHomeCmsModel } from '@/type/apps/homeCmsTypes'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, CardContent, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import LoadingComp from 'src/pages/components/LoadingComp/LoadingComp'
import { fetchAppFeatureCmsContent, fetchPackagesCmsContent, updateAppFeatureCmsContent, updatePackagesCmsContent } from 'src/services/functions/home-cms.api'
import { appFeatureContentValidationSchema, AppFeatureContentValidationSchemaType } from 'src/validation/homeCms.validation'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import toast from 'react-hot-toast'

const PackagesContent = () => {
  const { data, isLoading, refetch } = useQuery({
    refetchOnMount: false,
    queryKey: [listOfUniqueKeys.home.packages.contentFetch],
    queryFn: fetchPackagesCmsContent,
    retry: false
  })
  const cmsData: IHomeCmsModel['AppFeaturesContentData'] | undefined = useMemo(() => {
    return data?.data ?? undefined
  }, [data?.data])

  console.log('cmsData', cmsData )

  const initialDatas = {
    title: '',
    description: '',
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm<AppFeatureContentValidationSchemaType>({
    defaultValues: initialDatas,
    resolver: yupResolver(appFeatureContentValidationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    reset({
      header: cmsData?.header || '',
      description: cmsData?.description || '',
    })
  }, [data?.data])

  const { mutate, isPending } = useMutation({
    mutationFn: updatePackagesCmsContent,
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

  const onSubmit = (data: AppFeatureContentValidationSchemaType) => {
    const formData = new FormData()
    formData.append('header', data.header)
    formData.append('description', data.description)

    mutate(formData)
  }


  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage Package Content' className='secondaryDesign' />
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
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          label='Header'
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
                      render={({ field }: { field: { value: string;}}) => (
                        <TextField
                          fullWidth
                          multiline
                          rows={7}
                          label='Description'
                          {...field}
                          error={!!errors.description}
                          helperText={errors.description?.message}
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

export default PackagesContent
