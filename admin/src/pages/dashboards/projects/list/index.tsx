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

import { fetchProjects, deleteProject, updateProjectStatus } from 'src/services/functions/projects.api'

// ** Third Party Components
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { TProviderType } from 'src/types/apps/provider.type'

// ** Custom Table Components Imports
import TableHeaderClient from 'src/views/apps/projects/list/TableHeader'
import AddEditDrawer from 'src/views/apps/projects/list/AddEditDrawer'
import { Chip } from '@mui/material'
import { TEachProject } from 'src/types/apps/projects.type'
import { commonJobCategoriesList, commonLocationList } from 'src/services/functions/common.api'
import { TEachJobCategory } from 'src/types/apps/common.type'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface StatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: TEachProject
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
  const router = useRouter()
  const queryClient = useQueryClient()

  // ** Mutations for deleting client
  const deleteMutation = useMutation({
    mutationKey: ['deleteProject'],
    mutationFn: deleteProject,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchProjects'] })
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
        <MenuItem component={Link} href={`/dashboards/projects/${id}/details`} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:external-link' fontSize={20} />
          Bidding Details
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

const ProviderList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [debouncedFilterValue, setDebouncedFilterValue] = useState<string>('')
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [project, setProject] = useState<number | string>('')
  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false)
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

  const { data, isLoading: fetchProjectsLoading } = useQuery({
    queryKey: ['fetchProjects', debouncedFilterValue, paginationModel],
    queryFn: () =>
      fetchProjects(debouncedFilterValue, { page: paginationModel.page + 1, pageSize: paginationModel.pageSize })
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
    mutationKey: ['updateProjectStatus'],
    mutationFn: updateProjectStatus,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: ['fetchProjects'] })
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
    //   headerName: 'Project ID',
    //   renderCell: ({ row }: CellType) => (
    //     <Typography noWrap sx={{ color: 'text.secondary' }}>
    //       {row.id ? row.id : '-'}
    //       {/* {index} */}
    //     </Typography>
    //   )
    // },
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
            {row.project_title ? row.project_title : '-'}
          </Typography>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 200,
      field: 'project_category',
      headerName: 'Project Category',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {(jobCategory.find(category => Number(category?.id) === row?.project_category?.id)?.title as string) || 'NA'}
        </Typography>
      )
    },
    // {
    //   flex: 0.1,
    //   field: 'project_description',
    //   headerName: 'Project Description',
    //   renderCell: ({ row }: CellType) => {
    //     return (
    //       <Typography noWrap sx={{ color: 'text.secondary' }}>
    //         {row.project_description ? row.project_description : '-'}
    //       </Typography>
    //     )
    //   }
    // },
    // {
    //   flex: 0.1,
    //   field: 'project_location',
    //   headerName: 'Project Location',
    //   renderCell: ({ row }: CellType) => {
    //     return (
    //       <Typography noWrap sx={{ color: 'text.secondary' }}>
    //         {countries.find(country => Number(country?.id) === row?.project_location)?.country as string}
    //       </Typography>
    //     )
    //   }
    // },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'project_timeline',
      headerName: 'Project Timeline',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {`${row.project_timeline ? row.project_timeline : '-'} ${row.project_hrs_week ? row.project_hrs_week : '-'}`}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'project_budget',
      headerName: 'Project Budget',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {`$${row.project_budget.toFixed(2) ?? 0}`}
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
              onClick={() => {
                if (row?.status?.toLowerCase() === 'active' || row?.status?.toLowerCase() === 'inactive') {
                  handleStatusChangeClick(row.id)
                }
              }}
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
          toggleMode={() => (setMode('edit'), setAddProjectOpen(true), setProject(row.id))}
          handleStatusChangeClick={handleStatusChangeClick}
        />
      )
    }
  ]

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddEditDrawer = () => setAddProjectOpen(!addProjectOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage Projects' className='secondaryDesign' />
          <Divider sx={{ m: '0 !important' }} />
          <TableHeaderClient
            value={value}
            handleFilter={handleFilter}
            clearFilter={() => setValue('')}
            toggle={() => (toggleAddEditDrawer(), setMode('add'), setProject(''))}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            getRowId={row => row.id}
            rows={providers}
            columns={columns}
            loading={fetchProjectsLoading}
            paginationMode='server'
            rowCount={totalRecords}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      <AddEditDrawer open={addProjectOpen} toggle={() => toggleAddEditDrawer()} mode={mode} id={project} />
    </Grid>
  )
}

export default ProviderList
