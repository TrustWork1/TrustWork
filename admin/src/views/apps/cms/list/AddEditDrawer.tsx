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
import { fetchCmsById, storeCms, updateCms } from 'src/services/functions/cms.api'

// ** Validation Imports
import { yupResolver } from '@hookform/resolvers/yup'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { cmsSchema } from 'src/validation/cms.validation'
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
  mode: 'add' | 'edit'
}
interface CmsFormData {
  title: string
  content: string
  status: string
}

const defaultValues: CmsFormData = {
  title: '',
  content: '',
  status: 'active'
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const SidebarAddEdit: React.FC<SidebarAddEditProps> = ({ open, toggle, id, mode }) => {
  // ** React Query Client
  const queryClient = useQueryClient()

  const { data, refetch } = useQuery({
    queryKey: ['fetchCmsById', id],
    queryFn: () => fetchCmsById(id as string),
    enabled: !!id
  })

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(cmsSchema) })

  useEffect(() => {
    if (open && id) {
      refetch()
    }
  }, [open, id, refetch])

  useEffect(() => {
    if (data?.data && mode === 'edit') {
      setValue('title', data.data.title)
      setValue('content', data.data.content)
    } else if (mode === 'add') {
      reset(defaultValues)
    }
  }, [data?.data, setValue, mode, reset, open])

  // ** Mutation for updating user
  const updateMutator = useMutation({
    mutationKey: ['updateCms', id],
    mutationFn: (formData: CmsFormData) => updateCms(id as string, formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchCms'] })
    }
  })

  // ** Mutation for storing new user
  const storeMutator = useMutation({
    mutationKey: ['storeFaq'],
    mutationFn: (formData: CmsFormData) => storeCms(formData),
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchCms'] })
    }
  })

  const onSubmit = async (formData: CmsFormData) => {
    // console.log(formData, parseHTMLDataLength(formData.content), 'formData')
    if (!parseHTMLDataLength(formData.content)) {
      setError('content', { message: 'Content is required field' })

      return
    }

    try {
      if (mode === 'edit') {
        await updateMutator.mutateAsync(formData)
        console.log('Data Updated successfully', formData)
      } else {
        await storeMutator.mutateAsync(formData)
        console.log('Data Created successfully', formData)
      }
      toggle()
      reset()
    } catch (e) {
      console.error('Error updating CMS', e)
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
        <Typography variant='h5'>{mode === 'add' ? 'Add CMS' : 'Edit CMS'}</Typography>
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
            name='title'
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Title'
                error={Boolean(errors.title)}
                helperText={errors.title?.message}
                sx={{ mb: 4 }}
              />
            )}
          />
          <Controller
            name='content'
            control={control}
            rules={{ required: 'Content is required' }}
            render={({ field }) => (
              <CustomTextEditor
                value={field.value}
                onChange={field.onChange}
                error={Boolean(errors.content)}
                helperText={errors.content?.message as string}
              />
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
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
