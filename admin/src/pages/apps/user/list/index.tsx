// ** React Imports
import { useState, MouseEvent, useCallback, useMemo, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

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
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { globalSuccess } from 'src/lib/functions/_helpers.lib'

// ** Actions Imports
import { fetchUsers, deleteUser, updateUserStatus } from 'src/services/functions/user.api'

// ** Third Party Components
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import ConfirmDialog from 'src/@core/components/dialog'

interface UserStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: UsersType
}

const userStatusObj: UserStatusType = {
  Active: 'success',
  Pending: 'warning',
  Inactive: 'secondary'
}

// ** renders client column
const renderClient = (row: UsersType) => {
  if (row.profile_image) {
    return <CustomAvatar src={row.profile_image} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.full_name ? row.full_name : `${row.first_name} ${row.last_name}`)}
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

  // ** Mutations for deleting user
  const deleteMutation = useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: deleteUser,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchUsers'] })
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
    deleteMutation.mutate({ id: id })
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
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href='/apps/user/view/account'
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
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
        message='Are you sure you want to delete this user?'
      />
    </>
  )
}

const UserList = () => {
  // ** State
  const [filterValue, setFilterValue] = useState<string>('')
  const [debouncedFilterValue, setDebouncedFilterValue] = useState<string>('')
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [user, setUser] = useState<null | string>(null)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [statusDialogOpen, setStatusDialogOpen] = useState<{ [key: string]: boolean }>({})

  const queryClient = useQueryClient()

  // ** Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilterValue(filterValue)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [filterValue])

  // ** React Queries Hooks
  const { data } = useQuery({
    queryKey: ['fetchUsers', debouncedFilterValue, paginationModel],
    queryFn: () => fetchUsers(debouncedFilterValue, paginationModel)
  })
  const users = useMemo(() => {
    if (data?.data) {
      return data.data
    } else {
      return []
    }
  }, [data?.data])

  // ** Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationKey: ['updateUserStatus'],
    mutationFn: updateUserStatus,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchUsers'] })
    }
  })

  const handleStatusChangeClick = (id: number | string) => {
    setStatusDialogOpen(prev => ({ ...prev, [id]: true }))
  }

  const handleConfirmStatusChange = (id: number | string, status: string) => {
    const newStatus = status === 'Active' ? 'Inactive' : 'Active'
    updateStatusMutation.mutate({ id, status: newStatus })
    setStatusDialogOpen(prev => ({ ...prev, [id]: false }))
  }

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'full_name',
      headerName: 'Name',
      renderCell: ({ row }: CellType) => {
        const { first_name, last_name, full_name, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                href='/apps/user/view/account'
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {full_name ?? `${first_name} ${last_name}`}
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
      flex: 0.2,
      minWidth: 200,
      field: 'phone',
      headerName: 'Phone Number',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.phone ? row.phone : '-'}
        </Typography>
      )
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
              color={userStatusObj[row.status]}
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
          toggleMode={() => (setMode('edit'), setAddUserOpen(true), setUser(row._id))}
          handleStatusChangeClick={handleStatusChangeClick}
        />
      )
    }
  ]

  const handleFilter = useCallback((val: string) => {
    // setValue(val)
    setFilterValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage Admin User' />
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader
            value={filterValue}
            handleFilter={handleFilter}
            selectedRows={selectedRows}
            toggle={() => (toggleAddUserDrawer(), setMode('add'), setUser(null))}
            data={users}
            clearFilter={() => setFilterValue('')}
          />
          <DataGrid
            autoHeight
            pagination
            rowHeight={62}
            getRowId={row => row._id}
            rows={users}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={rows => setSelectedRows(rows)}
          />
        </Card>
      </Grid>
      <AddUserDrawer open={addUserOpen} toggle={() => toggleAddUserDrawer()} mode={mode} id={user} />
    </Grid>
  )
}

export default UserList
