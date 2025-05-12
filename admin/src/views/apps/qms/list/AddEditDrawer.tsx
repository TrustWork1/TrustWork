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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'

// ** Types Imports
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchReplyQmsById, updateReplyQms } from 'src/services/functions/qms.api'

// ** Validation Imports
import { yupResolver } from '@hookform/resolvers/yup'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { qmsSchema } from 'src/validation/qms.validation'
import { parseHTMLDataLength } from 'src/lib/functions/validationFn'
import CustomButtonPrimary from 'src/ui/Icons/CustomButtons/CustomButtonPrimary'
import dynamic from 'next/dynamic'

const CustomTextEditor = dynamic(() => import('src/@core/components/mui/text-editor'), {
  ssr: false
})
interface SidebarAddEditProps {
  open: boolean
  toggle: () => void
  id: string | number | null
}
interface QmsFormData {
  subject: string
  query: string
  content: string
}

const defaultValues: QmsFormData = {
  subject: '',
  query: '',
  content: ''
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const SidebarAddEdit: React.FC<SidebarAddEditProps> = ({ open, toggle, id }) => {
  // ** React Query Client
  const queryClient = useQueryClient()

  const { data, refetch } = useQuery({
    queryKey: ['fetchDetailsQMS', id],
    queryFn: () => fetchReplyQmsById(id as string),
    enabled: !!id,
    refetchOnWindowFocus: false,
    select(data) {
      return data?.data
    }
  })

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(qmsSchema) })

  useEffect(() => {
    if (open && id) {
      refetch()
    }
  }, [open, id, refetch])

  useEffect(() => {
    setValue('subject', data?.qms?.query as string)
    setValue('query', data?.qms?.answer as string)
    setValue('content', data?.response !== '' ? (data?.response as string) : '')
  }, [data?.qms?.query, data?.qms?.answer, data?.response, setValue, reset, open])

  // ** Mutation for updating user
  const updateMutator = useMutation({
    mutationKey: ['updateQms', id],
    mutationFn: (formData: QmsFormData) => updateReplyQms({ qms: id as string, response: formData?.content }),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchQms'] })
    }
  })

  const onSubmit = async (formData: QmsFormData) => {
    // console.log(formData, parseHTMLDataLength(formData.content), 'formData')
    if (!parseHTMLDataLength(formData.content)) {
      setError('content', { message: 'Content is required field' })

      return
    }

    try {
      await updateMutator.mutateAsync(formData)

      // console.log('Data Updated successfully', formData)

      toggle()
      reset()
    } catch (e) {
      console.error('Error updating QMS', e)
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
        <Typography variant='h5'>{'Reply QMS'}</Typography>
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
            name='subject'
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Subject'
                onChange={e => e.preventDefault()}
                error={Boolean(errors?.subject)}
                helperText={errors?.subject?.message}
                sx={{ mb: 4 }}
              />
            )}
          />

          <Controller
            name='query'
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Query'
                onChange={e => e.preventDefault()}
                error={Boolean(errors?.query)}
                helperText={errors?.query?.message}
                sx={{ mb: 4 }}
              />
            )}
          />

          <Controller
            name='content'
            control={control}
            rules={{ required: 'Reply Content is required' }}
            render={({ field }) => (
              <CustomTextEditor
                value={field.value || '<p></p>'}
                onChange={field.onChange}
                error={Boolean(errors?.content)}
                helperText={errors.content?.message as string}
              />
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
            <CustomButtonPrimary
              type='submit'
              variant='contained'
              sx={{ mr: 3 }}
              disabled={updateMutator.isPending}
              loading={updateMutator.isPending}
              configLoader={{
                color: 'success',
                size: 20
              }}
            >
              Submit
            </CustomButtonPrimary>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddEdit
