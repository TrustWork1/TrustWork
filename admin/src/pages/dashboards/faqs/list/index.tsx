/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState, MouseEvent, useMemo, useCallback, useEffect } from 'react'

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

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import ConfirmDialog from 'src/@core/components/dialog'

// ** Actions Imports
import { deleteFaq, fetchFaqs, updateFaqStatus } from 'src/services/functions/faq.api'

// ** Third Party Components
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports
import AddEditDrawer from 'src/views/apps/faq/list/AddEditDrawer'
import TableHeader from 'src/views/apps/faq/list/TableHeader'
import toast from 'react-hot-toast'

interface StatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: any
}

// ** renders client column

const statusObj: StatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
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

  const rowOptionsOpen = Boolean(anchorEl)
  const queryClient = useQueryClient()

  // ** Mutations for deleting client
  const deleteMutation = useMutation({
    mutationKey: ['deleteFaq'],
    mutationFn: deleteFaq,
    onSuccess: response => {
      // globalSuccess(response?.message)
      toast.success('FAQ deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['fetchFaqs'] })
    }
  })

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
        id=''
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
        message='Are you sure you want to delete this FAQ?'
      />
    </>
  )
}

const FaqList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [debouncedFilterValue, setDebouncedFilterValue] = useState<string>('')
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [faq, setFaq] = useState<string | number>('')
  const [drawerOpenClose, setDrawerOpenClose] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [statusDialogOpen, setStatusDialogOpen] = useState<{ [key: string]: boolean }>({})

  // ** Hooks
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

  // ** Fetch CMS data using React Queries
  const { data, isLoading: faqListLoading } = useQuery({
    queryKey: ['fetchFaqs', debouncedFilterValue, paginationModel],
    queryFn: () =>
      fetchFaqs(debouncedFilterValue, { page: paginationModel.page + 1, pageSize: paginationModel.pageSize })
  })

  const totalRecords = useMemo(() => {
    return data?.total || 0
  }, [data?.total])

  const faqs = useMemo(() => {
    if (data?.data) {
      return data.data
    } else {
      return []
    }
  }, [data?.data])

  console.log('faqs', faqs)

  // ** Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationKey: ['updateFaqStatus'],
    mutationFn: updateFaqStatus,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchFaqs'] })
    }
  })

  const handleStatusChangeClick = (id: number | string) => {
    setStatusDialogOpen(prev => ({ ...prev, [id]: true }))
  }

  const handleConfirmStatusChange = (id: number | string, status: string) => {
    const newStatus = status === 'active' ? 'inactive' : 'active'
    updateStatusMutation.mutate({ id, status: newStatus })
    setStatusDialogOpen(prev => ({ ...prev, [id]: false }))
  }

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 150,
      headerName: 'Question',
      field: 'question',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.question}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 150,
      headerName: 'Answer',
      field: 'answer',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.answer}
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
          toggleMode={() => (setMode('edit'), setDrawerOpenClose(true), setFaq(row.id))}
          handleStatusChangeClick={handleStatusChangeClick}
        />
      )
    }
  ]

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddEditDrawer = () => setDrawerOpenClose(!drawerOpenClose)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage FAQs' className='secondaryDesign' />
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={() => (toggleAddEditDrawer(), setMode('add'), setFaq(''))}
            clearFilter={() => setValue('')}
          />
          <DataGrid
            autoHeight
            getRowId={row => row.id}
            rowHeight={62}
            rows={faqs}
            columns={columns}
            loading={faqListLoading}
            paginationMode='server'
            rowCount={totalRecords}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      {drawerOpenClose && (
        <AddEditDrawer open={drawerOpenClose} toggle={() => toggleAddEditDrawer()} mode={mode} id={faq} />
      )}
    </Grid>
  )
}

export default FaqList
