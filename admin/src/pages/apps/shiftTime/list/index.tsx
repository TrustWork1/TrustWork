// ** React Imports
import { useState, MouseEvent, useCallback, useMemo } from 'react'

// ** Next Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import ConfirmDialog from 'src/@core/components/dialog'

// ** Utils Import
import { globalSuccess } from 'src/lib/functions/_helpers.lib'

// ** API Actions Imports
import { fetchShiftTime, deleteShiftTime, updateShiftTimeStatus } from 'src/services/functions/shifttime.api'

// ** Third Party Components
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports
import AddEditDrawer from 'src/views/apps/shiftTime/list/AddEditDrawer'
import TableHeader from 'src/views/apps/shiftTime/list/TableHeader'

type DataType = {
  _id: string
  name: string
  short_name: string
  status: string
}

interface CellType {
  row: DataType
}
interface StatusType {
  [key: string]: ThemeColor
}

const statusObj: StatusType = {
  Active: 'success',
  Pending: 'warning',
  Inactive: 'secondary'
}

const RowOptions = ({
  id,
  toggleMode,
  handleStatusChangeClick
}: {
  id: number | string
  toggleMode: () => void
  handleStatusChangeClick: (id: number | string) => void
}) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{ [key: string]: boolean }>({})

  const queryClient = useQueryClient()

  // ** Mutations for deleting client
  const deleteMutation = useMutation({
    mutationKey: ['deleteShiftTime'],
    mutationFn: deleteShiftTime,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchShiftTime'] })
    }
  })

  const rowOptionsOpen = Boolean(anchorEl)
  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteClick = (id: number | string) => {
    setDeleteDialogOpen(prev => ({ ...prev, [id]: true }))
  }
  const handleConfirmDelete = (id: number | string) => {
    deleteMutation.mutate({ shift_id: id })
    setDeleteDialogOpen(prev => ({ ...prev, [id]: false }))
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem onClick={() => (toggleMode(), setAnchorEl(null))} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(id)} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
        <MenuItem onClick={() => handleStatusChangeClick(id)} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:toggle-right' fontSize={20} />
          Change Status
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={deleteDialogOpen[id] || false}
        onClose={() => setDeleteDialogOpen(prev => ({ ...prev, [id]: false }))}
        onConfirm={() => handleConfirmDelete(id)}
        title='Confirm Delete'
        message='Are you sure you want to delete this branch?'
      />
    </>
  )
}

const ShiftTimeList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [shift, setShift] = useState<null | string>(null)
  const [addEditDrawer, setAddEditDrawer] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [statusDialogOpen, setStatusDialogOpen] = useState<{ [key: string]: boolean }>({})

  const queryClient = useQueryClient()

  // ** React Queries Hooks
  const { data: shiftTimeData } = useQuery({ queryKey: ['fetchShiftTime'], queryFn: fetchShiftTime })
  const shifts = useMemo(() => {
    if (shiftTimeData?.data) {
      return shiftTimeData.data
    } else {
      return []
    }
  }, [shiftTimeData?.data])

  console.log('shifts', shifts)

  // ** Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationKey: ['updateShiftTimeStatus'],
    mutationFn: updateShiftTimeStatus,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchShiftTime'] })
    }
  })

  const handleStatusChangeClick = (id: number | string) => {
    setStatusDialogOpen(prev => ({ ...prev, [id]: true }))
  }

  const handleConfirmStatusChange = (id: number | string, status: string) => {
    const newStatus = status === 'Active' ? 'Inactive' : 'Active'
    updateStatusMutation.mutate({ shift_id: id, status: newStatus })
    setStatusDialogOpen(prev => ({ ...prev, [id]: false }))
  }

  const columns: GridColDef[] = [
    {
      flex: 0.15,
      field: 'short_name',
      headerName: 'Short Title',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.short_name}
          </Typography>
        )
      }
    },
    {
      flex: 0.25,
      field: 'name',
      headerName: 'Title',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <>
            <CustomChip
              rounded
              skin='light'
              size='small'
              label={row.status}
              color={statusObj[row.status]}
              sx={{
                textTransform: 'capitalize',
                cursor: 'pointer',
                '&:hover': {
                  color: 'white'
                }
              }}
              onClick={() => handleStatusChangeClick(row._id)}
            />
            <ConfirmDialog
              open={statusDialogOpen[row._id] || false}
              onClose={() => setStatusDialogOpen(prev => ({ ...prev, [row._id]: false }))}
              onConfirm={() => handleConfirmStatusChange(row._id, row.status)}
              title='Confirm Status Change'
              message={`Are you sure you want to change the status?`}
            />
          </>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <RowOptions
          id={row._id}
          toggleMode={() => (setMode('edit'), setAddEditDrawer(true), setShift(row._id))}
          handleStatusChangeClick={handleStatusChangeClick}
        />
      )
    }
  ]

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddEditDrawer = () => setAddEditDrawer(!addEditDrawer)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage Shift Time' />
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={() => (toggleAddEditDrawer(), setMode('add'), setShift(null))}
            clearFilter={() => setValue('')}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            getRowId={row => row._id}
            rows={shifts}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      {addEditDrawer && (
        <AddEditDrawer open={addEditDrawer} toggle={() => toggleAddEditDrawer()} mode={mode} id={shift} />
      )}
    </Grid>
  )
}

export default ShiftTimeList
