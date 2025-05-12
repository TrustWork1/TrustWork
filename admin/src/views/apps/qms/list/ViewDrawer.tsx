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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types Imports
import { useQuery } from '@tanstack/react-query'
import { fetchReplyQmsById } from 'src/services/functions/qms.api'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { qmsViewSchema } from 'src/validation/qms.validation'
import dynamic from 'next/dynamic'

const CustomTextEditor = dynamic(() => import('src/@core/components/mui/text-editor'), {
  ssr: false
})
interface ViewQMSDrawerProps {
  open: boolean
  toggle: () => void
  id: string | number | null
}

interface QmsViewData {
  subject: string
  query: string
  content: string
}

const defaultValues: QmsViewData = {
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

const ViewQMSDrawer: React.FC<ViewQMSDrawerProps> = ({ open, toggle, id }) => {
  const {
    reset,
    control,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(qmsViewSchema) })

  const { data, refetch } = useQuery({
    queryKey: ['fetchReplyQMS', id],
    queryFn: () => fetchReplyQmsById(id as string),
    enabled: !!id,
    refetchOnWindowFocus: false,
    select(data) {
      return data?.data
    }
  })

  // console.log(data, 'data')

  useEffect(() => {
    setValue('subject', data?.qms?.query as string)
    setValue('query', data?.qms?.answer as string)
    setValue('content', data?.response !== '' ? (data?.response as string) : '')
  }, [data?.qms?.query, data?.qms?.answer, data?.response, setValue, reset, open])

  useEffect(() => {
    if (open && id) {
      refetch()
    }
  }, [open, id, refetch])

  const handleClose = () => {
    toggle()
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
        <form onSubmit={e => e.preventDefault()}>
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
                error={Boolean(errors.subject)}
                helperText={errors.subject?.message as string}
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
                error={Boolean(errors.query)}
                helperText={errors.query?.message as string}
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
                value={field.value}
                onChange={v => v}
                error={Boolean(errors.content)}
                helperText={errors.content?.message as string}
              />
            )}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Close
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default ViewQMSDrawer
