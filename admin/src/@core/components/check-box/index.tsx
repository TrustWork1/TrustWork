import React from 'react'
import { Checkbox, FormControlLabel, FormGroup, FormControl, FormHelperText, FormLabel } from '@mui/material'

interface Permission {
  _id: string
  permissionName: string
  permissionKey?: string // Add this to check for 'Administrator'
}

interface CustomCheckboxFieldProps {
  label: string
  permissions: Permission[]
  value: string[]
  onChange: (value: string[]) => void
  error?: boolean
  helperText?: string
}

const CustomCheckboxField: React.FC<CustomCheckboxFieldProps> = ({
  label,
  permissions,
  value,
  onChange,
  error,
  helperText
}) => {
  // Function to handle individual checkbox changes
  const handleCheckboxChange = (checked: boolean, permissionId: string, isAdmin: boolean) => {
    if (checked) {
      if (isAdmin) {
        // If "Administrator" is checked, select all permissions
        const allPermissionIds = permissions.map(p => p._id)
        onChange(allPermissionIds)
      } else {
        // Add individual permission ID to the selected values
        onChange([...value, permissionId])
      }
    } else {
      if (isAdmin) {
        // If "Administrator" is unchecked, unselect all permissions
        onChange([])
      } else {
        // Remove individual permission ID from the selected values
        onChange(value.filter(id => id !== permissionId))
      }
    }
  }

  // Determine if "Administrator" should be checked and all permissions should be selected
  const isAdminSelected = permissions.some(p => p.permissionKey === 'all:manage' && value.includes(p._id))

  console.log('Administrator', isAdminSelected)

  return (
    <FormControl component='fieldset' error={error}>
      <FormLabel>{label}</FormLabel>
      <FormGroup>
        {permissions.map(option => {
          const isAdmin = option.permissionKey === 'all:manage'
          const isChecked = isAdminSelected ? isAdminSelected : value.includes(option._id)

          return (
            <FormControlLabel
              key={option._id}
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={e => handleCheckboxChange(e.target.checked, option._id, isAdmin)}
                />
              }
              label={option.permissionName}
            />
          )
        })}
      </FormGroup>
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default CustomCheckboxField
