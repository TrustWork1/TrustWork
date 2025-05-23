// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <CustomTextField value={value} placeholder='Search User' onChange={e => handleFilter(e.target.value)} />
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* <Button sx={{ mr: 4 }} color='secondary' variant='tonal' startIcon={<Icon icon='tabler:upload' />}>
          Export
        </Button> */}
        <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Add New Manager
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
