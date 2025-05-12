// ** Next Import
import dynamic from 'next/dynamic'

// ** Types
import { EditorProps } from 'react-draft-wysiwyg'

// ! To avoid 'Window is not defined' error

//@ts-ignore
const ReactDraftWysiwyg = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false
})

export default ReactDraftWysiwyg
