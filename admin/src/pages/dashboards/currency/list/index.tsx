import React, { useState } from 'react'
// import OrderList from "src/module/orders/pages/OrderList";
import { Tabs, Tab, Box, Typography, Paper, styled } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CurrencyContent from '../content/CurrencyContent'

const CurrencyList = () => {
  const theme = useTheme()

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper
      }}
    >
      <Typography
        variant='h2'
        gutterBottom
        sx={{
          m: 2,
          fontWeight: 600
        }}
      >
        XAF Currency Section
      </Typography>

      <Box sx={{ p: 2 }}>
        <CurrencyContent />
      </Box>
    </Paper>
  )
}

export default CurrencyList
