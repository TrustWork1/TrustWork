// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CancelIcon from '@mui/icons-material/Cancel'

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleFilter: (val: string) => void
  clearFilter: () => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value, clearFilter } = props

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
        justifyContent: 'space-between',
        svg: {
          fill: '#DC2A31',
          cursor: 'pointer'
        }
      }}
    >
      <CustomTextField value={value} placeholder='Search User' onChange={e => handleFilter(e.target.value)} />
      {!!value?.length && <CancelIcon onClick={clearFilter} />}
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Add New Shift Time
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
