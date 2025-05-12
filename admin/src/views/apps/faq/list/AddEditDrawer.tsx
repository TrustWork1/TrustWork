// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'

// ** Types Imports
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchFaqById, updateFaq, storeFaq } from 'src/services/functions/faq.api'

// ** Validation Imports
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { TextField } from '@mui/material'
import CustomButtonPrimary from 'src/ui/Icons/CustomButtons/CustomButtonPrimary'

interface SidebarAddEditProps {
  open: boolean
  toggle: () => void
  id: string | number
  mode: 'add' | 'edit'
}

interface FaqFormData {
  question: string
  answer: string
  status: string
}

const defaultValues: FaqFormData = {
  question: '',
  answer: '',
  status: 'active'
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

// Define your Yup validation schema
const validationSchema = yup.object().shape({
  question: yup.string().required('Question is required').min(5, 'Question must be at least 5 characters'),
  answer: yup.string().required('Answer is required').min(10, 'Answer must be at least 10 characters')
})

const SidebarAddEdit: React.FC<SidebarAddEditProps> = ({ open, toggle, id, mode }) => {
  // ** React Query Client
  const queryClient = useQueryClient()

  const { data, refetch } = useQuery({
    queryKey: ['fetchFaqById', id],
    queryFn: () => fetchFaqById(id),
    enabled: !!id && mode === 'edit'
  })

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(validationSchema) })

  useEffect(() => {
    if (open && id) {
      refetch()
    }
  }, [open, id, refetch])

  useEffect(() => {
    if (data?.data && mode === 'edit') {
      setValue('question', data?.data.question)
      setValue('answer', data?.data.answer)
      setValue('status', data?.data.status)
    } else if (mode === 'add') {
      reset(defaultValues)
    }
  }, [data?.data, setValue, mode, reset, open])

  // ** Mutation for updating user
  const updateMutator = useMutation({
    mutationKey: ['updateFaq', id],
    mutationFn: (formData: FaqFormData) => updateFaq(id, formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchFaqs'] })
    }
  })

  // ** Mutation for storing new user
  const storeMutator = useMutation({
    mutationKey: ['storeFaq'],
    mutationFn: (formData: FaqFormData) => storeFaq(formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchFaqs'] })
    }
  })

  // ** Form submission handler
  const onSubmit = async (formData: FaqFormData) => {
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
      sx={{ '& .MuiDrawer-paper': { width: { xs: 500, sm: 600 } } }}
    >
      <Header>
        <Typography variant='h5'>{mode === 'add' ? 'Add FAQ' : 'Edit FAQ'}</Typography>
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
      <Box sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='question'
            control={control}
            rules={{ required: 'Question is required' }}
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
                label='Question'
                placeholder='Enter the question'
                error={Boolean(errors.question)}
                {...(errors.question && { helperText: errors.question.message })}
              />
            )}
          />
          <Controller
            name='answer'
            control={control}
            rules={{ required: 'Answer is required' }}
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
                label='Answer'
                placeholder='Enter the answer'
                error={Boolean(errors.answer)}
                {...(errors.answer && { helperText: errors.answer.message })}
              />
            )}
          />
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

export default SidebarAddEdit
