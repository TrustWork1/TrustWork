/* eslint-disable lines-around-comment */
// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import { Grid } from '@mui/material'

import { useQuery } from '@tanstack/react-query'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { fetchProjectsBidById } from 'src/services/functions/projects.api'

// ** Types Imports

interface SidebarAddEditType {
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

const SidebarAddEdit = (props: SidebarAddEditType) => {
  // ** Props
  const { open, toggle, mode, id } = props

  // ** Fetch Client data using React Queries (only when in edit mode)
  const { data, refetch } = useQuery({
    queryKey: ['fetchProjectsBidById', id],
    queryFn: () => fetchProjectsBidById(id as string),
    enabled: !!id && mode === 'edit',
    select(data) {
      return data?.data
    }
  })

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
        {/* <Typography variant='h5'>{props.mode === 'add' ? 'Add Project' : 'Edit Project'}</Typography> */}
        <Typography variant='h5'>{'Bid Details'}</Typography>
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
        <form onSubmit={e => e.preventDefault()}>
          <Grid container>
            {/* Title */}
            <Grid item md={12} sx={{ px: 2, mb: 3 }}>
              <Typography>
                <strong>Quotation Details:</strong>
              </Typography>
              <Typography variant='body2'>{data?.quotation_details || 'NA'}</Typography>
            </Grid>
            <Grid item md={12} sx={{ px: 2, mb: 3 }}>
              <Typography>
                <strong>Details:</strong>
              </Typography>
              <Typography variant='body2'>{data?.bid_details || 'NA'}</Typography>
            </Grid>

            <Grid item md={6} sx={{ px: 2, mb: 3 }}>
              <Typography>
                <strong>Cost:</strong>
              </Typography>
              <Typography variant='body2'>{`$ ${Number(data?.project_total_cost || 0)?.toFixed(2)}`}</Typography>
            </Grid>
            <Grid item md={6} sx={{ px: 2, mb: 3 }}>
              <Typography>
                <strong>Timeline:</strong>
              </Typography>
              <Typography variant='body2'>{`${data?.time_line || 'NA'} ${data?.time_line_hour || 'NA'}`}</Typography>
            </Grid>

            <Grid item md={12} sx={{ px: 2, mb: 3 }}>
              <Typography>
                <strong>Status:</strong>
              </Typography>
              <Typography variant='body2'>{data?.status?.toUpperCase() || 'NA'}</Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddEdit
