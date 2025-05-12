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

import { fetchProviders, deleteProvider, updateProviderStatus } from 'src/services/functions/provider.api'

// ** Third Party Components
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { TJobCategory, TProviderType } from 'src/types/apps/provider.type'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/provider/list/TableHeaderClient'
import AddEditDrawer from 'src/views/apps/provider/list/AddEditDrawer'
import { Chip, styled } from '@mui/material'

interface StatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: TProviderType
}

const statusObj: StatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** renders provider column
const renderProvider = (row: TProviderType) => {
  if (row.profile_picture) {
    return <CustomAvatar src={row.profile_picture} sx={{ mr: 2.5, width: 38, height: 38 }} />
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

  // ** Mutations for deleting client
  const deleteMutation = useMutation({
    mutationKey: ['deleteProvider'],
    mutationFn: deleteProvider,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchProviders'] })
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
    deleteMutation.mutate(id as string)

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
        message='Are you sure you want to delete this Provider?'
      />
    </>
  )
}

const StyledDataGrid = styled(DataGrid)`
  .MuiDataGrid-virtualScrollerContent {
    height: fit-content !important;
    .MuiDataGrid-virtualScrollerRenderZone {
      position: static;
      .MuiDataGrid-row {
        max-height: fit-content !important;
        border-bottom: 1px solid rgba(47, 43, 61, 0.16);
        .MuiDataGrid-cell {
          /* padding: 4px 0px; */
          max-height: fit-content !important;
          .MuiTypography-root {
            height: fit-content;
          }
        }
      }
    }
  }
`

const ProviderList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [debouncedFilterValue, setDebouncedFilterValue] = useState<string>('')
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [provider, setProvider] = useState<number | string>('')
  const [addProviderOpen, setAddProviderOpen] = useState<boolean>(false)
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
  const {
    data,
    isLoading: providerListLoading,
    refetch
  } = useQuery({
    queryKey: ['fetchProviders', debouncedFilterValue, paginationModel],
    queryFn: () =>
      fetchProviders(debouncedFilterValue, { page: paginationModel.page + 1, pageSize: paginationModel.pageSize })
  })

  const totalRecords = useMemo(() => {
    return data?.total || 0
  }, [data?.total])

  const providers = useMemo(() => {
    if (data?.data) {
      return data.data
    } else {
      return []
    }
  }, [data?.data])

  // ** Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationKey: ['updateProviderStatus'],
    mutationFn: updateProviderStatus,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchProviders'] })
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
    // {
    //   flex: 0.1,
    //   minWidth: 150,
    //   field: 'id',
    //   headerName: 'ID',
    //   renderCell: ({ row }: CellType) => (
    //     <Typography noWrap sx={{ color: 'text.secondary' }}>
    //       {row.id ? row.id : '-'}
    //     </Typography>
    //   )
    // },
    {
      flex: 0.25,
      field: 'full_name',
      headerName: 'Name',
      renderCell: ({ row }: CellType) => {
        const { first_name, last_name, full_name, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderProvider(row)}
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

    // {
    //   flex: 0.15,
    //   minWidth: 220,
    //   headerName: 'Email',
    //   field: 'email',
    //   renderCell: ({ row }: CellType) => {
    //     return (
    //       <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
    //         {row.email}
    //       </Typography>
    //     )
    //   }
    // },
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
      flex: 0.2,
      minWidth: 300,
      field: 'services',
      headerName: 'Services',
      renderCell: ({ row }: CellType) => (
        <Typography
          noWrap
          sx={{ color: 'text.secondary', display: 'flex', flexWrap: 'wrap', gap: 1, overflowY: 'auto' }}
        >
          {row?.job_category && row?.job_category?.length >= 4 ? (
            <>
              {row?.job_category?.map((service: TJobCategory, index: number) =>
                index >= 3 ? null : (
                  <Chip key={index} label={service?.job_category__title} color='info' variant='outlined' size='small' />
                )
              )}
              <Chip
                key={`men`}
                label={`+${row?.job_category?.length - 3}`}
                color='info'
                variant='outlined'
                size='small'
              />
            </>
          ) : (
            row?.job_category?.map((service: TJobCategory, index: number) => (
              <Chip key={index} label={service?.job_category__title} color='info' variant='outlined' size='small' />
            ))
          )}
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
          toggleMode={() => (setMode('edit'), setAddProviderOpen(true), setProvider(row.id as string))}
          handleStatusChangeClick={handleStatusChangeClick}
        />
      )
    }
  ]

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddEditDrawer = () => setAddProviderOpen(!addProviderOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage Providers' className='secondaryDesign' />
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={() => (toggleAddEditDrawer(), setMode('add'), setProvider(''))}
            clearFilter={() => setValue('')}
          />
          <StyledDataGrid
            autoHeight
            rowHeight={62}
            getRowId={row => row.id}
            rows={providers}
            columns={columns}
            loading={providerListLoading}
            paginationMode='server'
            rowCount={totalRecords}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      {addProviderOpen && (
        <AddEditDrawer
          open={addProviderOpen}
          toggle={() => toggleAddEditDrawer()}
          mode={mode}
          id={provider}
          refetchProviderList={refetch}
        />
      )}
    </Grid>
  )
}

export default ProviderList
