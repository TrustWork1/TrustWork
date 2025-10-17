import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, IconButton, Typography } from '@mui/material'
import { Delete, Description } from '@mui/icons-material'

interface CustomDropzoneProps {
  fileType?: 'video' | 'document'
  onDrop: (file: File) => void
  accept?: string[]
  maxSize?: number
  errorMessage?: string
  preview?: string
  onDelete: () => void
  customPreview?: string
  isBigVideo?: boolean
}

const CustomDropzone: React.FC<CustomDropzoneProps> = ({
  fileType,
  onDrop,
  onDelete,
  accept,
  maxSize,
  preview,
  customPreview,
  isBigVideo = false
}) => {
  const [fileError, setFileError] = useState<string | undefined>(undefined)

  // Convert array to proper react-dropzone format
  const getAcceptObject = () => {
    if (!accept || accept.length === 0) return undefined

    // Map MIME types to extensions
    const acceptObj: Record<string, string[]> = {}

    accept.forEach(item => {
      if (item.startsWith('.')) {
        // It's an extension, map it to appropriate MIME type
        if (item === '.mov') acceptObj['video/quicktime'] = ['.mov']
        else if (item === '.mp4') acceptObj['video/mp4'] = ['.mp4']
        else if (item === '.webm') acceptObj['video/webm'] = ['.webm']
        else if (item === '.ogg') acceptObj['video/ogg'] = ['.ogg']
        else if (item === '.avi') acceptObj['video/x-msvideo'] = ['.avi']
      } else if (item === 'video/*') {
        // Accept all video types
        acceptObj['video/*'] = []
      } else {
        // It's already a MIME type
        acceptObj[item] = []
      }
    })

    return acceptObj
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: getAcceptObject(),
    maxSize: maxSize,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setFileError(undefined)
        onDrop(file)
      }
    },
    onDropRejected: rejectedFiles => {
      if (rejectedFiles[0].errors[0].code === 'file-too-large') {
        setFileError(`File is larger than ${(maxSize as number) / 1000000} MB`)
      } else {
        setFileError(rejectedFiles[0].errors[0].message)
      }
    }
  })

  const renderPreview = () => {
    if (!preview && !customPreview) return null

    if (fileType === 'video') {
      return (
        <Box mt={1} height='300px' width={isBigVideo ? '500px' : '300px'} position={'relative'}>
          <video
            src={preview}
            controls
            autoPlay
            style={{
              objectFit: 'cover',
              height: '100%',
              width: '100%',
              borderRadius: '15px'
            }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: '5px',
              right: '5px'
            }}
            onClick={onDelete}
          >
            <Delete sx={{ color: theme => theme.palette.error.main }} />
          </IconButton>
        </Box>
      )
    }

    if (fileType === 'document') {
      return (
        <Box
          mt={1}
          p={1}
          position={'relative'}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Description />
          <Typography>{customPreview}</Typography>
          <IconButton
            sx={{
              position: 'absolute',
              right: '5px'
            }}
            onClick={onDelete}
          >
            <Delete sx={{ color: theme => theme.palette.error.main }} />
          </IconButton>
        </Box>
      )
    }

    return (
      <Box
        mt={2}
        height='200px'
        width='200px'
        position={'relative'}
        sx={{
          background: '#191919',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src={preview}
          alt='Preview'
          style={{
            objectFit: 'cover',
            height: '100px',
            width: '100px',
            borderRadius: '15px'
          }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: '5px',
            right: '5px'
          }}
          onClick={onDelete}
        >
          <Delete
            sx={{
              color: theme => theme.palette.error.main
            }}
          />
        </IconButton>
      </Box>
    )
  }

  return (
    <Box>
      <Box
        {...getRootProps({
          className: 'dropzone',
          style: { border: '2px dashed gray', padding: '20px', textAlign: 'center', cursor: 'pointer' }
        })}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive ? (
            'Drop the file here...'
          ) : (
            <span>
              Drag 'n' drop a{' '}
              <strong>{fileType ? fileType.charAt(0).toUpperCase() + fileType.slice(1) : 'Image'}</strong> here, or
              click to select one
            </span>
          )}
        </Typography>
      </Box>
      <Box>
        {fileError && <Typography sx={{ color: '#FF2E2E', mt: 1 }}>{fileError}</Typography>}
        {renderPreview()}
      </Box>
    </Box>
  )
}

export default CustomDropzone
