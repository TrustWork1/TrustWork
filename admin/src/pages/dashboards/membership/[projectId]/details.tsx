/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState, MouseEvent, useCallback, useMemo } from 'react'

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

import {
  fetchProjectsBidList,
  deleteProject,
  updateProjectStatus,
  updateProjectBidStatus,
  fetchProjectById
} from 'src/services/functions/projects.api'

// ** Third Party Components
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { TProviderType } from 'src/types/apps/provider.type'

// ** Custom Table Components Imports
import AddEditDrawer from 'src/views/apps/projects/details/AddEditDrawer'
import { Button, Chip, TextField } from '@mui/material'
import { TEachProject, TEachProjectBidding } from 'src/types/apps/projects.type'
import { commonJobCategoriesList, commonLocationList } from 'src/services/functions/common.api'
import { TEachJobCategory } from 'src/types/apps/common.type'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface StatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: TEachProjectBidding
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
    mutationKey: ['deleteProject'],
    mutationFn: deleteProject,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchProjectsBidList'] })
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
        <MenuItem
          // component={Link}
          sx={{ '& svg': { mr: 2 } }}
          // href='/apps/user/view/account'
          // onClick={handleRowOptionsClose}
          onClick={() => (toggleMode(), setAnchorEl(null))}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        {/* <MenuItem
          onClick={() => (toggleMode(), setAnchorEl(null))}
          sx={{
            '& svg': { mr: 2 },
            backgroundColor: '#4B991E',
            color: '#FFFFFF',
            '&:hover': { backgroundColor: '#4B991E !important', color: '#FFFFFF !important' }
          }}
        >
          <Icon icon='tabler:check' fontSize={20} />
          Accept Bid
        </MenuItem>
        <MenuItem
          onClick={() => (toggleMode(), setAnchorEl(null))}
          sx={{
            '& svg': { mr: 2 },
            backgroundColor: '#DCE210',
            color: '#111610',
            '&:hover': { backgroundColor: '#DCE210 !important', color: '#111610 !important' }
          }}
        >
          <Icon icon='tabler:x' fontSize={20} />
          Reject Bid
        </MenuItem> */}
        {/* <MenuItem onClick={() => (toggleMode(), setAnchorEl(null))} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem> */}
        {/* <MenuItem onClick={() => handleDeleteClick(id)} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem> */}
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
        message='Are you sure you want to delete this Project?'
      />
    </>
  )
}

const ProviderBiddingDetails = () => {
  // ** State
  const router = useRouter()
  const projectID = router.query.projectId as string
  const [value, setValue] = useState<string>('')
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [provider, setProvider] = useState<number | string>('')
  const [addProviderOpen, setAddProviderOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [statusDialogOpen, setStatusDialogOpen] = useState<{ [key: string]: boolean }>({})

  const queryClient = useQueryClient()

  // ** React Queries Hooks

  const { data: projectDetails, isLoading: projectDetailsLoading } = useQuery({
    queryKey: ['fetchProjectById', projectID],
    queryFn: () => fetchProjectById(projectID),
    enabled: !!projectID,
    select(data) {
      return data?.data
    }
  })

  const {
    data,
    refetch,
    isLoading: bidListLoading
  } = useQuery({
    queryKey: ['fetchProjectsBidList', projectID, paginationModel],
    queryFn: () =>
      fetchProjectsBidList(projectID, '', { page: paginationModel.page + 1, pageSize: paginationModel.pageSize }),
    enabled: !!projectID
  })

  const totalRecords = useMemo(() => {
    return data?.total || 0
  }, [data?.total])

  const bidList = useMemo(() => {
    if (data?.data) {
      return data.data
    } else {
      return []
    }
  }, [data?.data])

  // ** Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationKey: ['updateProjectBidStatus'],
    mutationFn: updateProjectBidStatus,
    onSuccess: response => {
      globalSuccess(response?.message)
      refetch()
      queryClient.invalidateQueries({ queryKey: ['fetchProjectsBidList'] })
    }
  })

  const { data: countryData } = useQuery({
    queryKey: ['commonLocationList'],
    queryFn: commonLocationList
  })
  const countries: { id: string; country: string }[] = useMemo(() => {
    if (countryData?.data) {
      return countryData.data
    } else {
      return []
    }
  }, [countryData?.data])

  const { data: commonJobCategoryData } = useQuery({
    queryKey: ['commonJobCategoriesList'],
    queryFn: commonJobCategoriesList
  })
  const jobCategory: TEachJobCategory[] = useMemo(() => {
    if (commonJobCategoryData?.data) {
      return commonJobCategoryData.data
    } else {
      return []
    }
  }, [commonJobCategoryData?.data])

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
    //   headerName: 'Bidding ID',
    //   renderCell: ({ row }: CellType) => (
    //     <Typography noWrap sx={{ color: 'text.secondary' }}>
    //       {row.id ? `#${row.id}` : '-'}
    //     </Typography>
    //   )
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 150,
    //   field: 'project',
    //   headerName: 'Project ID',
    //   renderCell: ({ row }: CellType) => (
    //     <Typography noWrap sx={{ color: 'text.secondary' }}>
    //       {row.project ? row.project : '-'}
    //     </Typography>
    //   )
    // },
    {
      flex: 0.2,
      field: 'quotation_details',
      headerName: 'Quotation Details',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row.quotation_details ? row.quotation_details : '-'}
          </Typography>
        )
      }
    },
    // {
    //   flex: 0.1,
    //   field: 'bid_details',
    //   headerName: 'Bid Details',
    //   renderCell: ({ row }: CellType) => {
    //     return (
    //       <Typography noWrap sx={{ color: 'text.secondary' }}>
    //         {row.bid_details ? row.bid_details : '-'}
    //       </Typography>
    //     )
    //   }
    // },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'service_provider',
      headerName: 'Service Provider',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {/* {jobCategory.find(category => Number(category?.id) === row?.project_category)?.title as string} */}
          {row.service_provider?.full_name ? row.service_provider?.full_name : '-'}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'time_line',
      headerName: 'Timeline',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.time_line ? row.time_line : '-'}
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
          toggleMode={() => (setMode('edit'), setAddProviderOpen(true), setProvider(row.id))}
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
          <CardHeader title='Project Details' className='secondaryDesign' />
          <Box sx={{ p: theme => theme.spacing(0, 6, 6), mt: 8 }}>
            <Grid container>
              {/* Title */}
              <Grid item md={12} sx={{ px: 2, mb: 3 }}>
                <Typography>
                  <strong>Project Title:</strong>
                </Typography>
                <Typography variant='body2'>{projectDetails?.project_title || 'NA'}</Typography>
              </Grid>
              <Grid item md={12} sx={{ px: 2, mb: 3 }}>
                <Typography>
                  <strong>Project Description:</strong>
                </Typography>
                <Typography variant='body2'>{projectDetails?.project_description || 'NA'}</Typography>
              </Grid>

              <Grid item md={6} sx={{ px: 2, mb: 3 }}>
                <Typography>
                  <strong>Budget:</strong>
                </Typography>
                <Typography variant='body2'>{`$${Number(projectDetails?.project_budget ?? 0).toFixed(2)}`}</Typography>
              </Grid>
              <Grid item md={6} sx={{ px: 2, mb: 3 }}>
                <Typography>
                  <strong>Timeline:</strong>
                </Typography>
                <Typography variant='body2'>{projectDetails?.project_timeline || 'NA'}</Typography>
              </Grid>
              <Grid item md={6} sx={{ px: 2, mb: 3 }}>
                <Typography>
                  <strong>Project Address:</strong>
                </Typography>
                <Typography variant='body2'>{projectDetails?.project_address || 'NA'}</Typography>
              </Grid>
              <Grid item md={6} sx={{ px: 2, mb: 0 }}>
                <Typography>
                  <strong>Status:</strong>
                </Typography>
                <Typography variant='body2'>
                  <strong>{String(projectDetails?.status).toUpperCase() || 'NA'}</strong>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Card sx={{ mt: 5 }}>
          <CardHeader title='Project Biddings' className='secondaryDesign' />
          <Divider sx={{ m: '0 !important' }} />
          <DataGrid
            autoHeight
            rowHeight={62}
            getRowId={row => row.id}
            rows={bidList}
            columns={columns}
            loading={bidListLoading}
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
        <AddEditDrawer open={addProviderOpen} toggle={() => toggleAddEditDrawer()} mode={mode} id={provider} />
      )}
    </Grid>
  )
}

export default ProviderBiddingDetails
