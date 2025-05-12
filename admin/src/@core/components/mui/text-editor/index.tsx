import React, { useEffect, useState, useCallback } from 'react'
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import { Box, Typography } from '@mui/material'

interface CustomTextEditorProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
  helperText?: string
}

const CustomTextEditor: React.FC<CustomTextEditorProps> = ({ value, onChange, error, helperText }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

  useEffect(() => {
    if (value && value !== draftToHtml(convertToRaw(editorState.getCurrentContent()))) {
      const blocksFromHTML = convertFromHTML(value)
      const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
      setEditorState(EditorState.createWithContent(contentState))
    }
  }, [value, editorState])

  const handleEditorChange = useCallback(
    (newState: EditorState) => {
      setEditorState(newState)
      const rawContentState = convertToRaw(newState.getCurrentContent())
      const htmlContent = draftToHtml(rawContentState)
      onChange(htmlContent)
    },
    [onChange]
  )

  return (
    <Box>
      <EditorWrapper sx={{ border: error ? '1px solid red' : undefined }}>
        <ReactDraftWysiwyg
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
            inline: { inDropdown: false },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: false }
          }}
        />
      </EditorWrapper>
      {error && helperText && (
        <Typography color='error' variant='caption' sx={{ mt: 1 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

export default CustomTextEditor
