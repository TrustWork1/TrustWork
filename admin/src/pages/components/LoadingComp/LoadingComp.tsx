import { Box, Grid, Typography } from '@mui/material'
import { Loader } from 'lucide-react'
import React from 'react'

const LoadingComp = () => {
  return (
    <Grid item md={12} display='flex' justifyContent='center' alignItems='center'>
      <Box
        display='flex'
        alignItems='center'
        gap={1}
        sx={{
          py: 2
        }}
      >
        <Typography variant='body1'>Loading...</Typography>
        <Loader size={20} />
      </Box>
    </Grid>
  )
}

export default LoadingComp
