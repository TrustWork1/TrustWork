// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

interface PickerProps {
  label?: string
  readOnly?: boolean
}

const CustomInput = forwardRef(({ ...props }: PickerProps, ref) => {
  // ** Props
  const { label, readOnly } = props

  return (
    <CustomTextField
      fullWidth
      {...props}
      inputRef={ref}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  )
})

const StepPropertyArea = () => {
  // ** States
  const [date, setDate] = useState<DateType>(null)

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <CustomTextField
          fullWidth
          type='number'
          label='Total Area'
          placeholder='1000'
          InputProps={{
            endAdornment: <InputAdornment position='end'>sq-ft</InputAdornment>
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          fullWidth
          type='number'
          placeholder='800'
          label='Carpet Area'
          InputProps={{
            endAdornment: <InputAdornment position='end'>sq-ft</InputAdornment>
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomTextField
          fullWidth
          type='number'
          label='Plot Area'
          placeholder='800'
          InputProps={{
            endAdornment: <InputAdornment position='end'>sq-yd</InputAdornment>
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        {/* @ts-ignore */}
        <DatePicker
          selected={date}
          placeholderText='YYY-MM-DD'
          onChange={(date: Date) => setDate(date)}
          customInput={<CustomInput label='Available From' />}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl>
          <FormLabel id='possession-status-radio' sx={{ fontSize: theme => theme.typography.body2.fontSize }}>
            Possession Status
          </FormLabel>
          <RadioGroup
            name='possession-status-group'
            defaultValue='under-construction'
            aria-labelledby='possession-status-radio'
          >
            <FormControlLabel value='under-construction' control={<Radio />} label='Under Construction' />
            <FormControlLabel value='ready-to-move' control={<Radio />} label='Ready to Move' />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl>
          <FormLabel id='transaction-radio' sx={{ fontSize: theme => theme.typography.body2.fontSize }}>
            Transaction Type
          </FormLabel>
          <RadioGroup defaultValue='new-property' name='transaction-group' aria-labelledby='transaction-radio'>
            <FormControlLabel value='new-property' control={<Radio />} label='New property' />
            <FormControlLabel value='resale' control={<Radio />} label='Resale' />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl>
          <FormLabel id='main-road-radio' sx={{ fontSize: theme => theme.typography.body2.fontSize }}>
            Is Property Facing Main Road?
          </FormLabel>
          <RadioGroup defaultValue='yes' name='main-road-group' aria-labelledby='main-road-radio'>
            <FormControlLabel value='yes' control={<Radio />} label='Yes' />
            <FormControlLabel value='no' control={<Radio />} label='no' />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl>
          <FormLabel id='gated-colony-radio' sx={{ fontSize: theme => theme.typography.body2.fontSize }}>
            Gated Colony?
          </FormLabel>
          <RadioGroup defaultValue='yes' name='gated-colony-group' aria-labelledby='gated-colony-radio'>
            <FormControlLabel value='yes' control={<Radio />} label='Yes' />
            <FormControlLabel value='no' control={<Radio />} label='no' />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default StepPropertyArea
