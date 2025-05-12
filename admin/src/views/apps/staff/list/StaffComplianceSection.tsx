import React from 'react'
import { Control, Controller, useFieldArray } from 'react-hook-form'
import { Grid, Typography, Button, Checkbox, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { StaffData } from 'src/interface/staff.insterface'
import CustomTextField from 'src/@core/components/mui/text-field'

interface StaffComplianceSectionProps {
  control: Control<StaffData>
  data: Array<{
    _id: string
    name: string
    options: Array<{ _id: string; name: string }>
    status: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
  }>
  uploadedFileNames: string[]
  setUploadedFileNames: React.Dispatch<React.SetStateAction<string[]>>
  uploadedFilePreviews: string[]
  setUploadedFilePreviews: React.Dispatch<React.SetStateAction<string[]>>
}

const StaffComplianceSection: React.FC<StaffComplianceSectionProps> = ({
  control,
  data,
  uploadedFileNames,
  setUploadedFileNames,
  uploadedFilePreviews,
  setUploadedFilePreviews
}) => {
  useFieldArray({
    control,
    name: 'staff_complieation'
  })

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6' gutterBottom>
          Staff Compliance
        </Typography>
      </Grid>

      {/* Render existing fields using the data array */}
      {data.map((compliance, index) => (
        <React.Fragment key={compliance._id}>
          {/* Compliance Title */}
          <Grid item xs={4}>
            <Typography>{compliance.name}</Typography>
          </Grid>
          <Grid container spacing={2}>
            {/* Document Type Dropdown */}
            <Grid item xs={4}>
              <Controller
                name={`staff_complieation.${index}.document_type_id`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField select fullWidth label='Document Type' {...field}>
                    {compliance.options.map(option => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* File Upload */}
            <Grid item xs={4}>
              <Typography>Document File</Typography>
              <Controller
                name={`staff_complieation.${index}.file`}
                control={control}
                render={({ field: { onChange, ref } }) => (
                  <Button
                    variant='outlined'
                    component='label'
                    color='secondary'
                    startIcon={<Icon icon='tabler:cloud-upload' fontSize={20} />}
                  >
                    Upload File
                    <input
                      type='file'
                      accept='image/*'
                      hidden
                      ref={ref}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files ? e.target.files[0] : null
                        onChange(file) // Set the file in the form state

                        if (file) {
                          // Set the uploaded file name for this index
                          const newFileNames = [...uploadedFileNames]
                          newFileNames[index] = file.name
                          setUploadedFileNames(newFileNames)

                          // Create a URL for the file preview
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            const newPreviews = [...uploadedFilePreviews]
                            newPreviews[index] = reader.result as string
                            setUploadedFilePreviews(newPreviews)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </Button>
                )}
              />
              {/* Display the uploaded file name */}
              {uploadedFileNames[index] && (
                <Typography variant='body2' style={{ marginTop: '8px' }}>
                  Uploaded File: {uploadedFileNames[index]}
                </Typography>
              )}
              {/* Display image preview if applicable */}
              {uploadedFilePreviews[index] && (
                <img
                  src={uploadedFilePreviews[index]}
                  alt='Uploaded Preview'
                  style={{ marginTop: '8px', maxWidth: '100%', height: 'auto' }}
                />
              )}
            </Grid>

            {/* Verified Checkbox */}
            <Grid item xs={4}>
              <Typography>Is Document Verified?</Typography>
              <Controller
                name={`staff_complieation.${index}.isVerified`}
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <Checkbox
                    checked={value || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
                    {...rest}
                  />
                )}
              />
            </Grid>

            {/* Hidden Field for staffcompliance_id */}
            <Controller
              name={`staff_complieation.${index}.staffcompliance_id`}
              control={control}
              defaultValue={compliance._id}
              render={() => <></>}
            />
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  )
}

export default StaffComplianceSection
