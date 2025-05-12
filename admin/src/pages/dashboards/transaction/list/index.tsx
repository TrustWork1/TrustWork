/* eslint-disable @typescript-eslint/no-unused-vars */
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

import { updateMembershipStatus, deleteMembership } from 'src/services/functions/membership.api'

// ** Third Party Components
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { TProviderType } from 'src/types/apps/provider.type'

// ** Custom Table Components Imports
// import TableHeaderClient from 'src/views/apps/membership/list/TableHeader'
import AddEditDrawer from 'src/views/apps/membership/list/AddEditDrawer'
import { commonJobCategoriesList, commonLocationList } from 'src/services/functions/common.api'
import { TEachJobCategory } from 'src/types/apps/common.type'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { TEachMembership } from 'src/types/apps/membership.type'
import { fetchTransaction } from 'src/services/functions/transaction.api'
import { TEachTransaction } from '@/type/apps/transaction.type'
import { renderPaymentStatus } from 'src/lib/functions/validationFn'
import moment from 'moment'
import { HUMAN_READABLE_DATE_TIME_FORMAT, VALID_DATE_TIME_FORMAT } from 'src/configs/constant'

interface StatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: TEachTransaction
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
  handleStatusChangeClick?: (id: number | string) => void
}) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{ [key: string]: boolean }>({})
  const router = useRouter()
  const queryClient = useQueryClient()

  // ** Mutations for deleting client
  const deleteMutation = useMutation({
    mutationKey: ['deleteMembership'],
    mutationFn: deleteMembership,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchTransaction'] })
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
        <MenuItem component={Link} href={`/dashboards/projects/${id}/details`} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:external-link' fontSize={20} />
          Project Details
        </MenuItem>
        {/* <MenuItem onClick={() => (toggleMode(), setAnchorEl(null))} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem> */}
        {/* <MenuItem onClick={() => handleDeleteClick(id)} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem> */}
        {/* <MenuItem
          onClick={() => {
            handleStatusChangeClick(id)
            handleRowOptionsClose()
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:toggle-right' fontSize={20} />
          Change Status
        </MenuItem> */}
      </Menu>

      <ConfirmDialog
        open={deleteDialogOpen[id] || false}
        onClose={() => setDeleteDialogOpen(prev => ({ ...prev, [id]: false }))}
        onConfirm={() => handleConfirmDelete(id)}
        title='Confirm Delete'
        message='Are you sure you want to delete this Transaction?'
      />
    </>
  )
}

const TransactionList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [debouncedFilterValue, setDebouncedFilterValue] = useState<string>('')
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [transact, setTransact] = useState<number | string>('')
  const [addTransactionOpen, setAddTransactionOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

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

  const { data, isLoading: fetchTransactionLoading } = useQuery({
    queryKey: ['fetchTransaction', debouncedFilterValue, paginationModel],
    queryFn: () =>
      fetchTransaction(debouncedFilterValue, { page: paginationModel.page + 1, pageSize: paginationModel.pageSize })
  })

  const totalRecords = useMemo(() => {
    return data?.total || 0
  }, [data?.total])

  const transactions = useMemo(() => {
    return (
      data?.data?.map((item, index) => ({
        ...item,
        unique_id: `${item.escrow_id}_${index}`
      })) ?? []
    )
  }, [data?.data])

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'created_at',
      headerName: 'Date',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: 'none',
              color: 'text.secondary'
            }}
          >
            {moment(row?.created_at).format(HUMAN_READABLE_DATE_TIME_FORMAT)}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      field: 'project_title',
      headerName: 'Project Title',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: 'none',
              color: 'text.secondary'
            }}
          >
            {row?.project?.project_title ? row?.project?.project_title : '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'transection_amount',
      headerName: 'Amount',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {`$${Number(row?.transection_amount ?? 0).toFixed(2)}`}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Box key={`status_${row?.escrow_id}_${row?.created_at}`}>
            {/* {console.log(`status_${row?.escrow_id}_${row?.created_at}_${Math.random()}`, 'row')} */}
            {/* {row?.status} */}
            {/* {renderPaymentStatus(row?.status)} */}
            <CustomChip
              rounded
              skin='light'
              size='small'
              label={renderPaymentStatus(row?.status)}
              sx={{
                textTransform: 'capitalize',
                cursor: 'pointer'
                // '&:hover': {
                //   color: 'white'
                // }
              }}
              // onClick={() => handleStatusChangeClick(row.escrow_id)}
            />
            {/* <ConfirmDialog
              open={statusDialogOpen[row.escrow_id] || false}
              onClose={() => setStatusDialogOpen(prev => ({ ...prev, [row.escrow_id]: false }))}
              onConfirm={() => handleConfirmStatusChange(row.escrow_id, row.status)}
              title='Confirm Status Change'
              message={`Are you sure you want to change the status?`}
            /> */}
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => (
        <RowOptions
          id={row?.project?.id}
          toggleMode={() => (setMode('edit'), setAddTransactionOpen(true), setTransact(row?.project?.id))}
          // handleStatusChangeClick={handleStatusChangeClick}
        />
      )
    }
  ]

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddEditDrawer = () => setAddTransactionOpen(!addTransactionOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Transaction' className='secondaryDesign' />
          <Divider sx={{ m: '0 !important' }} />
          {/* <TableHeaderClient
            value={value}
            handleFilter={handleFilter}
            toggle={() => (toggleAddEditDrawer(), setMode('add'), setProvider(''))}
          /> */}
          <DataGrid
            autoHeight
            rowHeight={62}
            getRowId={row => row?.unique_id}
            rows={transactions}
            columns={columns}
            loading={fetchTransactionLoading}
            paginationMode='server'
            rowCount={totalRecords}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      {addTransactionOpen && (
        <AddEditDrawer open={addTransactionOpen} toggle={() => toggleAddEditDrawer()} mode={mode} id={transact} />
      )}
    </Grid>
  )
}

export default TransactionList
