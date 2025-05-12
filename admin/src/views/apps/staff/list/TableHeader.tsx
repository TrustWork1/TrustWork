// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { GridRowId } from '@mui/x-data-grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Additional Imports for CSV and Excel Export
import { saveAs } from 'file-saver'
import { Parser } from 'json2csv'
import * as XLSX from 'xlsx'
import CancelIcon from '@mui/icons-material/Cancel'

interface TableHeaderStaffProps {
  value: string
  toggle: () => void
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
  data: Record<string, any>[]
  clearFilter: () => void
}

const TableHeader = (props: TableHeaderStaffProps) => {
  // ** Props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleFilter, toggle, value, data, selectedRows,clearFilter } = props

  console.log('selectedRows', selectedRows)

  // ** CSV Export Function
  const exportToCSV = () => {
    try {
      // Define custom fields
      const fields = [
        { label: 'Name', value: 'full_name' },
        { label: 'Email', value: 'email' },
        { label: 'Secondary Email', value: 'secondary_email' },
        { label: 'Phone', value: 'phone' },
        { label: 'Secondary Phone', value: 'secondary_phone' },
        { label: 'Status', value: 'status' }
      ]

      // Filter the data to include only the selected rows based on their IDs
      const filteredData = data.filter(row => selectedRows.includes(row._id))

      if (filteredData.length === 0) {
        console.warn('No rows selected for export.')

        return
      }

      // Initialize the parser with custom fields
      const json2csvParser = new Parser({ fields })

      // Parse the filtered data into CSV format
      const csv = json2csvParser.parse(filteredData)

      // Create a CSV file and download it
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().slice(0, 10) // YYYY-MM-DD format

      // Set the filename with the current date
      const fileName = `Managers_${currentDate}.csv`

      // Use file-saver to download the file
      saveAs(blob, fileName)
    } catch (error) {
      console.error('Error exporting CSV:', error)
    }
  }

  // ** Excel Export Function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      saveAs(blob, 'export.xlsx')
    } catch (error) {
      console.error('Error exporting Excel:', error)
    }
  }

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
      <CustomTextField value={value} placeholder='Search Staff' onChange={e => handleFilter(e.target.value)} />
      {!!value?.length && <CancelIcon onClick={clearFilter} />}
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          sx={{ mr: 4 }}
          color='secondary'
          variant='tonal'
          startIcon={<Icon icon='tabler:download' />}
          onClick={exportToCSV}
        >
          Export
        </Button>
        <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Add New Staff
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
