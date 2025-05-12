import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose, onConfirm, title, message }) => {
  // Handle onClose to prevent closing on backdrop click or pressing "Escape"
  const handleClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose} // Use custom handleClose to control the dialog close behavior
      maxWidth='xs'
      fullWidth
      disableEscapeKeyDown // This will also prevent closing with the "Escape" key
    >
      <DialogTitle>{title || 'Confirmation'}</DialogTitle>
      <DialogContent>
        <Box display='flex' alignItems='center' mb={2}>
          <AlertTriangle color='red' size={24} style={{ marginRight: '8px' }} />
          <Typography variant='body1'>{message || 'Are you sure you want to proceed?'}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          No
        </Button>
        <Button onClick={onConfirm} color='primary' variant='contained'>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
