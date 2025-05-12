// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** API Imports
import { fetchShiftTimeById, storeShiftTime, updateShiftTime } from 'src/services/functions/shifttime.api'

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'
import CustomButtonPrimary from 'src/ui/Icons/CustomButtons/CustomButtonPrimary'

// ** Types Imports
// import { ManagerData } from 'src/interface/user.insterface'

// ** YUP Validation
const createSchema = yup.object().shape({
  name: yup.string().required('Name is required')
})

interface SidebarPropsType {
  open: boolean
  toggle: () => void
  mode: 'add' | 'edit'
  id: null | number | string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

interface ManagerData {
  shift_id: string
  name: string
  short_name: string
}

const defaultValues: ManagerData = {
  shift_id: '',
  name: '',
  short_name: ''
}

const SidebarAddBranch = (props: SidebarPropsType) => {
  // ** Props
  const { open, toggle, mode, id } = props

  // ** React Query Client
  const queryClient = useQueryClient()

  // ** Fetch User data using React Queries (only when in edit mode)
  const { data, refetch } = useQuery({
    queryKey: ['fetchShiftTimeById', id],
    queryFn: () => fetchShiftTimeById(id),
    enabled: !!id && mode === 'edit'
  })

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(createSchema)
  })

  // ** Populate the form fields when data is available
  useEffect(() => {
    if (data?.data && mode === 'edit') {
      setValue('shift_id', data.data._id)
      setValue('name', data.data.name)
      setValue('short_name', data.data.short_name)
    } else if (mode === 'add') {
      reset(defaultValues)
    }
  }, [data?.data, setValue, mode, reset])

  useEffect(() => {
    if (open && id) {
      refetch()
    }
  }, [open, id, refetch])

  // ** Mutation for updating user
  const updateMutator = useMutation({
    mutationKey: ['updateShiftTime'],
    mutationFn: updateShiftTime,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchShiftTime'] })
    }
  })

  // ** Mutation for storing new user
  const storeMutator = useMutation({
    mutationKey: ['storeShiftTime'],
    mutationFn: storeShiftTime,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchShiftTime'] })
    }
  })

  // ** Form submission handler
  const onSubmit = async (formData: any) => {
    console.log('Submitted Form Data', formData)

    try {
      if (mode === 'edit') {
        await updateMutator.mutateAsync(formData)
        console.log('Data Updated successfully', formData)
      } else {
        await storeMutator.mutateAsync(formData)
        console.log('Data Created successfully', formData)
      }

      // Reset form and close modal (or whatever you need to do after submission)
      toggle()
      reset()
    } catch (e) {
      console.error('Error saving data', e)
    }
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>{props.mode === 'add' ? 'Add Shift Time' : 'Edit Shift Time'}</Typography>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='text'
                label='Name'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                placeholder='Enter name'
                error={Boolean(errors.name)}
                {...(errors.name && { helperText: errors.name.message })}
              />
            )}
          />
          <Controller
            name='short_name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='text'
                label='Short Name'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                placeholder='Enter short name'
                error={Boolean(errors.short_name)}
                {...(errors.short_name && { helperText: errors.short_name.message })}
              />
            )}
          />
          {/* <Controller
            name='description'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                rows={4}
                multiline
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Description'
                onChange={onChange}
                placeholder='Enter Description'
                error={Boolean(errors.title)}
                {...(errors.title && { helperText: errors.title.message })}
              />
            )}
          /> */}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            >
              {mode === 'add' ? 'Add' : 'Update'}
            </CustomButtonPrimary>
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddBranch
