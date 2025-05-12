import { useEffect, useMemo } from 'react'
// import OrderList from "src/module/orders/pages/OrderList";
import { ITermsAndPrivacyCmsModel } from '@/type/apps/terms-policy'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import {
  fetchTermsAndConditionCmsContent,
  updateTermsAndConditionCmsContent
} from 'src/services/functions/terms-policy-cms.api'
import { TermsPolicyValidationSchemaType, termsPolicyValidationSchema } from 'src/validation/terms-policyCms.validation'

const CustomTextEditor = dynamic(() => import('src/@core/components/mui/text-editor'), {
  ssr: false
})
interface CmsFormData {
  section_header: string
  section_description: string
  details: string
}

const defaultValues: CmsFormData = {
  section_header: '',
  section_description: '',
  details: ''
}

const TermsAndConditions = () => {
  const theme = useTheme()

  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    refetchOnMount: false,
    queryKey: [listOfUniqueKeys.termsPolicy.terms.content],
    queryFn: fetchTermsAndConditionCmsContent,
    retry: false
  })
  const cmsData: ITermsAndPrivacyCmsModel['TermsAndPrivacyData'] | undefined = useMemo(() => {
    return data?.data ?? undefined
  }, [data?.data])

  console.log('cmsData', { cmsData })

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors }
  } = useForm<TermsPolicyValidationSchemaType>({ defaultValues, resolver: yupResolver(termsPolicyValidationSchema) })

  useEffect(() => {
    reset({
      section_header: cmsData?.section_header || '',
      section_description: cmsData?.section_description || '',
      details: cmsData?.details || ''
    })
  }, [data?.data])

  // ** Mutation for updating user
  const { mutate, isPending } = useMutation({
    mutationFn: updateTermsAndConditionCmsContent,
    onSuccess: res => {
      if (String(res.status) === '200') {
        toast.success(res.message)
        refetch()
      }
    },
    onError: error => {
      toast.error(`Failed to update app content: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

  const onSubmit = (data: TermsPolicyValidationSchemaType) => {
    const formData = new FormData()
    formData.append('section_header', data.section_header)
    formData.append('section_description', data.section_description)
    formData.append('details', data.details)

    mutate(formData)
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper
      }}
    >
      <Typography
        variant='h2'
        gutterBottom
        sx={{
          m: 2,
          fontWeight: 600
        }}
      >
        Terms & Conditions
      </Typography>

      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Controller
                name='section_header'
                control={control}
                render={({ field }: { field: { value: string } }) => (
                  <TextField
                    fullWidth
                    label='Header'
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
                render={({ field }: { field: { value: string } }) => (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label='Description'
                    {...field}
                    error={!!errors.section_description}
                    helperText={errors.section_description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='details'
                control={control}
                rules={{ required: 'Content is required' }}
                render={({ field }) => (
                  <CustomTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    error={Boolean(errors.details)}
                    helperText={errors.details?.message as string}
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
      </Box>
    </Paper>
  )
}

export default TermsAndConditions
