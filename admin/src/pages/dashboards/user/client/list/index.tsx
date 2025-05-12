// ** React Imports
import { useState, MouseEvent, useCallback, useMemo, useEffect } from 'react'

// ** Next Imports
// import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
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
import CustomAvatar from 'src/@core/components/mui/avatar'
import ConfirmDialog from 'src/@core/components/dialog'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** lib Import
import { globalSuccess } from 'src/lib/functions/_helpers.lib'

// ** Actions Imports
import { fetchClients, deleteClient, updateClientStatus } from 'src/services/functions/client.api'

// ** Third Party Components
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { TClientType } from 'src/types/apps/client'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/client/list/TableHeader'
import AddEditDrawer from 'src/views/apps/client/list/AddEditDrawer'

interface StatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: TClientType
}

const statusObj: StatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** renders client column
const renderClient = (row: TClientType) => {
  if (row.profile_picture) {
    return <CustomAvatar src={row.profile_picture} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.username ? row.username : `${row.first_name} ${row.last_name}`)}
      </CustomAvatar>
    )
  }
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
    mutationKey: ['deleteClient'],
    mutationFn: deleteClient,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchClients'] })
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
    handleRowOptionsClose()
    setDeleteDialogOpen(prev => ({ ...prev, [id]: true }))
  }
  const handleConfirmDelete = (id: number | string) => {
    deleteMutation.mutate(id)
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
        {/* <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href='/apps/user/view/account'
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem> */}
        <MenuItem onClick={() => (toggleMode(), setAnchorEl(null))} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(id)} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleStatusChangeClick(id)
            handleRowOptionsClose()
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:toggle-right' fontSize={20} />
          Change Status
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={deleteDialogOpen[id] || false}
        onClose={() => setDeleteDialogOpen(prev => ({ ...prev, [id]: false }))}
        onConfirm={() => handleConfirmDelete(id)}
        title='Confirm Delete'
        message='Are you sure you want to delete this Client?'
      />
    </>
  )
}

const ClientList = () => {
  const [value, setValue] = useState<string>('')
  const [debouncedFilterValue, setDebouncedFilterValue] = useState<string>('')
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [client, setClient] = useState<number | string>('')
  const [addEditOpen, setAddEditOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [statusDialogOpen, setStatusDialogOpen] = useState<{ [key: string]: boolean }>({})

  const queryClient = useQueryClient()

  // ** Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilterValue(value)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [value])

  // ** React Queries Hooks
  const { data: clientData, isLoading: clientListLoading } = useQuery({
    queryKey: ['fetchClients', debouncedFilterValue, paginationModel],
    queryFn: () =>
      fetchClients(debouncedFilterValue, { page: paginationModel.page + 1, pageSize: paginationModel.pageSize })
  })

  const totalRecords = useMemo(() => {
    return clientData?.total || 0
  }, [clientData?.total])

  const clients = useMemo(() => {
    if (clientData?.data) {
      return clientData.data
    } else {
      return []
    }
  }, [clientData?.data])

  // ** Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationKey: ['updateClientStatus'],
    mutationFn: updateClientStatus,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchClients'] })
    }
  })

  const handleStatusChangeClick = (id: number | string) => {
    setStatusDialogOpen(prev => ({ ...prev, [id]: true }))
  }

  const handleConfirmStatusChange = (id: number | string, status: string) => {
    const newStatus = status === 'active' ? 'inactive' : 'active'
    updateStatusMutation.mutate({ id: id, status: newStatus })
    setStatusDialogOpen(prev => ({ ...prev, [id]: false }))
  }

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      field: 'full_name',
      headerName: 'Name',
      renderCell: ({ row }: CellType) => {
        const { first_name, last_name, username, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap

                // component={Link}
                // href='/apps/user/view/account'
                // sx={{
                //   fontWeight: 500,
                //   textDecoration: 'none',
                //   color: 'text.secondary',
                //   '&:hover': { color: 'primary.main' }
                // }}
              >
                {username ?? `${first_name} ${last_name}`}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Phone',
      field: 'phone',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.phone}
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
              onClick={() => handleStatusChangeClick(row.id)}
            />
            <ConfirmDialog
              open={statusDialogOpen[row.id] || false}
              onClose={() => setStatusDialogOpen(prev => ({ ...prev, [row.id]: false }))}
              onConfirm={() => handleConfirmStatusChange(row.id, row.status)}
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
          id={row.id}
          toggleMode={() => (setMode('edit'), setAddEditOpen(true), setClient(row.id))}
          handleStatusChangeClick={handleStatusChangeClick}
        />
      )
    }
  ]

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddEditDrawer = () => setAddEditOpen(!addEditOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage Client' className='secondaryDesign' />
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={() => (toggleAddEditDrawer(), setMode('add'), setClient(''))}
            clearFilter={() => setValue('')}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            getRowId={row => row.id}
            rows={clients}
            columns={columns}
            loading={clientListLoading}
            paginationMode='server'
            rowCount={totalRecords}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      {addEditOpen && <AddEditDrawer open={addEditOpen} toggle={() => toggleAddEditDrawer()} mode={mode} id={client} />}
    </Grid>
  )
}

export default ClientList
