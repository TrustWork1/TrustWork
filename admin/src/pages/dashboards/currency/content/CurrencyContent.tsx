// ** React Imports
import { ICurrencyModel } from '@/type/apps/currencyTypes'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, CardContent, TextField } from '@mui/material'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import LoadingComp from 'src/pages/components/LoadingComp/LoadingComp'
import { fetchCurrencyListContent, updateCurrencyContent } from 'src/services/functions/currency.api'
import { currencyValidationSchema, CurrencyValidationSchemaType } from 'src/validation/currency.validation'

const CurrencyContent = () => {
  const { data, isLoading, refetch } = useQuery({
    refetchOnMount: false,
    queryKey: [listOfUniqueKeys.currency.list],
    queryFn: fetchCurrencyListContent,
    retry: false
  })

  const currencyData: ICurrencyModel['CurrencyList'] | undefined = useMemo(() => {
    return data?.data ?? undefined
  }, [data?.data])

  const [isEditing, setIsEditing] = useState(false)

  const initialDatas = {
    xaf_currency: ''
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CurrencyValidationSchemaType>({
    defaultValues: initialDatas,
    resolver: yupResolver(currencyValidationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    reset({
      xaf_currency: currencyData?.xaf_currency || ''
    })
  }, [data?.data])

  const { mutate, isPending } = useMutation({
    mutationFn: updateCurrencyContent,
    onSuccess: res => {
      if (String(res.status) === '200') {
        toast.success(res.message)
        refetch()
        setIsEditing(false) // Exit edit mode
      }
    },
    onError: error => {
      toast.error(`Failed to update currency information: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

  const onSubmit = (data: CurrencyValidationSchemaType) => {
    mutate({ xaf_currency: data.xaf_currency })
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(true)
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
              <>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Controller
                        name='xaf_currency'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            label='XAF Currency'
                            {...field}
                            disabled={!isEditing || isPending}
                            error={!!errors.xaf_currency}
                            helperText={errors.xaf_currency?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {isEditing && (
                        <Button type='submit' variant='contained' disabled={isPending}>
                          {isPending ? 'Saving...' : 'Save'}
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </form>
                {!isEditing && (
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Button type='button' variant='outlined' onClick={handleEditClick}>
                        Edit
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CurrencyContent
