import React, { useEffect } from 'react'
import { Grid, Typography, TextField } from '@mui/material'
import { Control, Controller, useFieldArray } from 'react-hook-form'

// Define the shape of a single shift time
interface ShiftTime {
  _id: string
  name: string
  short_name: string
  description?: string
}

// Define the shape of a shift in the form
interface Shift {
  shift_id: string
  price: string
}

// Define the props for the ShiftTimesGrid component
interface ShiftTimesGridProps {
  control: Control<any>
  shiftTimes: ShiftTime[]
}

const ShiftTimesGrid: React.FC<ShiftTimesGridProps> = ({ control, shiftTimes }) => {
  const { fields, append } = useFieldArray<{ shifts: Shift[] }>({
    control,
    name: 'shifts'
  })

  useEffect(() => {
    if (fields.length === 0 && shiftTimes.length > 0) {
      // Initially append all shifts if there are no existing fields
      shiftTimes.forEach(shift => {
        append({ shift_id: shift._id, price: '' })
      })
    } else if (fields.length !== shiftTimes.length) {
      // Find which shiftTimes are missing in fields by comparing shift_id
      const existingShiftIds = fields.map(field => field.shift_id)

      shiftTimes.forEach(shift => {
        if (!existingShiftIds.includes(shift._id)) {
          // Append only the shifts that don't already exist in fields
          append({ shift_id: shift._id, price: '' })
        }
      })
    }
  }, [shiftTimes, fields, append])

  return (
    <Grid container spacing={2}>
      {fields.map((field, index) => (
        <Grid item xs={12} sm={6} md={4} key={field.id}>
          <Typography variant='subtitle1'>{shiftTimes[index]?.short_name}</Typography>
          <Typography variant='body2' color='textSecondary' gutterBottom>
            {shiftTimes[index]?.description}
          </Typography>
          <Controller
            name={`shifts.${index}.price`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                value={value}
                type='number'
                placeholder='Enter Price'
                fullWidth
                variant='outlined'
                size='small'
                InputProps={{
                  startAdornment: <Typography variant='body2'>$</Typography>
                }}
                onChange={onChange}
              />
            )}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default ShiftTimesGrid
