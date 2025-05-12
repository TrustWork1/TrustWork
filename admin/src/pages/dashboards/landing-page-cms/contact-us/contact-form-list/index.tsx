// ** React Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { MouseEvent, useCallback, useMemo, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import TableHeaderAddFeatures from 'src/views/apps/landing-page-cms/about/why-trust-us/list/TableHeader'

import ConfirmDialog from 'src/@core/components/dialog'
import { globalSuccess } from 'src/lib/functions/_helpers.lib'
import { deleteWhyTrustUsPointsList, fetchWhyTrustUsPointsList } from 'src/services/functions/about-cms.api'
import { fetchContactFormList } from 'src/services/functions/contact-cms.api'
import AddEditDrawer from 'src/views/apps/landing-page-cms/contact/contact-form/list/AddEditDrawer'

export type RowData = {
  id: number
  full_name: string
  email: string
  subject: string
  message: string
}

interface CellType {
  row: RowData
}

const RowOptions = ({ id, toggleMode }: { id: number | string; toggleMode: () => void }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{ [key: string]: boolean }>({})

  const rowOptionsOpen = Boolean(anchorEl)
  const queryClient = useQueryClient()

  // ** Mutations for deleting app feature

  const deleteMutation = useMutation({
    mutationKey: [listOfUniqueKeys.home.howItworks.delete],
    mutationFn: deleteWhyTrustUsPointsList,
    onSuccess: response => {
      globalSuccess(response?.message)
      queryClient.invalidateQueries({ queryKey: [listOfUniqueKeys.aboutUs.whyTrustUs.list] })
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
          <Icon icon='tabler:eye' fontSize={20} />
          View Details
        </MenuItem>
        {/* <MenuItem onClick={() => handleDeleteClick(id)} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem> */}
      </Menu>
      <ConfirmDialog
        open={deleteDialogOpen[id] || false}
        onClose={() => setDeleteDialogOpen(prev => ({ ...prev, [id]: false }))}
        onConfirm={() => handleConfirmDelete(id)}
        title='Confirm Delete'
        message='Are you sure you want to delete this Feature?'
      />
    </>
  )
}

const ContactFormSubmissionList = () => {
  const [provider, setProvider] = useState<number | string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [value, setValue] = useState<string>('')
  const [addProviderOpen, setAddProviderOpen] = useState<boolean>(false)
  const [getFullRowDetails, setFullRowDetails] = useState<RowData>()

  const { data } = useQuery({ queryKey: [listOfUniqueKeys.contactUs.contactList.list], queryFn: fetchContactFormList })

  const cmsData = useMemo(() => {
    if (data?.data) {
      return data.data
    } else {
      return []
    }
  }, [data?.data])

  console.log(cmsData, 'Points data')

  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 150,
      field: 'full_name',
      headerName: 'Full Name',
      renderCell: ({ row }: CellType) => {
        const { full_name } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography noWrap>{full_name}</Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => {
        const { email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography noWrap>{email}</Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'subject',
      headerName: 'Subject',
      renderCell: ({ row }: CellType) => {
        const { subject } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography noWrap>{subject}</Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      minWidth: 250,
      field: 'message',
      headerName: 'Message',
      renderCell: ({ row }: CellType) => {
        const { message } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography noWrap>{message}</Typography>
            </Box>
          </Box>
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
          toggleMode={() => (setAddProviderOpen(true), setProvider(row.id), setFullRowDetails(row))}
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
        {/* <Typography
          variant='h2'
          gutterBottom
          sx={{
            m: 2,
            fontWeight: 600
          }}
        >
          App Features Section
        </Typography> */}
        <Card>
          <CardHeader title='Contact Form Submission List' className='secondaryDesign' />
          <Divider sx={{ m: '0 !important' }} />
          {/* <TableHeaderAddFeatures
            value={value}
            handleFilter={handleFilter}
            toggle={() => (toggleAddEditDrawer(), setMode('add'), setProvider(''), setFullRowDetails(undefined))}
            clearFilter={() => setValue('')}
          /> */}
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
      {addProviderOpen && (
        <AddEditDrawer
          open={addProviderOpen}
          toggle={() => toggleAddEditDrawer()}
          id={provider}
          fullRowDetails={getFullRowDetails}
        />
      )}
    </Grid>
  )
}

export default ContactFormSubmissionList
