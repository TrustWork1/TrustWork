// ** React Imports
import { useState, MouseEvent, useMemo } from 'react'

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

// ** library Imports
import { globalSuccess } from 'src/lib/functions/_helpers.lib'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import ConfirmDialog from 'src/@core/components/dialog'

// ** Actions Imports
import { fetchCms, updateCmsStatus } from 'src/services/functions/cms.api'

// ** Third Party Components
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports
import AddEditDrawer from 'src/views/apps/cms/list/AddEditDrawer'

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

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
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
    </>
  )
}

const CMSList = () => {
  // ** State
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [cms, setCms] = useState<null | number>(null)
  const [drawerOpenClose, setDrawerOpenClose] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [statusDialogOpen, setStatusDialogOpen] = useState<{ [key: string]: boolean }>({})

  // ** Hooks
  const queryClient = useQueryClient()

  // ** Fetch CMS data using React Queries
  const { data } = useQuery({ queryKey: ['fetchCms'], queryFn: fetchCms })
  const cmsData = useMemo(() => {
    if (data?.data) {
      return data.data
    } else {
      return []
    }
  }, [data?.data])

  console.log('cmsData', cmsData)

  // ** Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationKey: ['updateCmsStatus'],
    mutationFn: updateCmsStatus,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchCms'] })
    }
  })

  const handleStatusChangeClick = (id: number | string) => {
    setStatusDialogOpen(prev => ({ ...prev, [id]: true }))
  }

  const handleConfirmStatusChange = (id: number | string, status: string) => {
    // console.log('statusChange', status)

    const newStatus = status === 'active' ? 'inactive' : 'active'
    updateStatusMutation.mutate({ id, status: newStatus })
    setStatusDialogOpen(prev => ({ ...prev, [id]: false }))
  }

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 200,
      field: 'title',
      headerName: 'Title',
      renderCell: ({ row }: CellType) => {
        const { title } = row

        return (
          <Box id={row.id} sx={{ display: 'flex', alignItems: 'center' }}>
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
                {title}
              </Typography>
            </Box>
          </Box>
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
          toggleMode={() => (setMode('edit'), setDrawerOpenClose(true), setCms(row.id))}
          handleStatusChangeClick={handleStatusChangeClick}
        />
      )
    }
  ]

  const toggleAddEditDrawer = () => setDrawerOpenClose(!drawerOpenClose)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage CMS' className='secondaryDesign' />
          <Divider sx={{ m: '0 !important' }} />
          <DataGrid
            autoHeight
            getRowId={row => row.id}
            rowHeight={62}
            rows={cmsData}
            columns={columns}
            disableRowSelectionOnClick
            hideFooterPagination
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      {drawerOpenClose && (
        <AddEditDrawer open={drawerOpenClose} toggle={() => toggleAddEditDrawer()} mode={mode} id={cms} />
      )}
    </Grid>
  )
}

export default CMSList
