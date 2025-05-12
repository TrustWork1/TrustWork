
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable lines-around-comment */
// ** React Imports
import { ChangeEvent, ElementType, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import { Grid, TextField, Divider } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const LabelTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(1)
}))

const ValueTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  marginBottom: theme.spacing(3),
  color: theme.palette.text.secondary
}))

interface SidebarAddEditType {
  open: boolean
  toggle: () => void
  mode?: 'add' | 'edit'
  id: null | number | string
  fullRowDetails: any | undefined
}

const SidebarAddEdit = (props: SidebarAddEditType) => {
  // ** Props
  const { open, toggle, fullRowDetails } = props

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
        <Typography variant='h5'>Details</Typography>
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
        {fullRowDetails && (
          <Grid container>
            <Grid item xs={12} sx={{ mb: 4 }}>
              <LabelTypography>Full Name</LabelTypography>
              <ValueTypography>{fullRowDetails.full_name || 'N/A'}</ValueTypography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} sx={{ mb: 4 }}>
              <LabelTypography>Email</LabelTypography>
              <ValueTypography>{fullRowDetails.email || 'N/A'}</ValueTypography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} sx={{ mb: 4 }}>
              <LabelTypography>Subject</LabelTypography>
              <ValueTypography>{fullRowDetails.subject || 'N/A'}</ValueTypography>
              <Divider />
            </Grid>
            
            <Grid item xs={12}>
              <LabelTypography>Message</LabelTypography>
              <Box 
                sx={{ 
                  p: 3, 
                  borderRadius: 1, 
                  bgcolor: 'action.hover',
                  maxHeight: '350px',
                  overflowY: 'auto'
                }}
              >
                <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>
                  {fullRowDetails.message || 'N/A'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Drawer>
  )
}

export default SidebarAddEdit
