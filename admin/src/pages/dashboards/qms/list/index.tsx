// ** React Imports
import { useState, MouseEvent, useMemo, useCallback } from 'react'

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

// ** Actions Imports
import { fetchQms } from 'src/services/functions/qms.api'

// ** Third Party Components
import { useQuery } from '@tanstack/react-query'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports

import { TClientType } from 'src/types/apps/client'
import { getInitials } from 'src/@core/utils/get-initials'
import { TQMSEach } from 'src/types/apps/qms.type'
import dynamic from 'next/dynamic'

const AddEditDrawer = dynamic(() => import('src/views/apps/qms/list/AddEditDrawer'), { ssr: false })
const ViewQMSDrawer = dynamic(() => import('src/views/apps/qms/list/ViewDrawer'), { ssr: false })

interface StatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: TQMSEach
}

const statusObj: StatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'error'
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
  toggleMode,
  status,
  handleOpenViewReply
}: {
  id: number | string
  toggleMode: () => void
  status: string
  handleOpenViewReply: () => void
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
        {status === 'active' ? (
          <MenuItem onClick={() => (toggleMode(), setAnchorEl(null))} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:edit' fontSize={20} />
            Reply
          </MenuItem>
        ) : (
          <MenuItem onClick={() => (handleOpenViewReply(), setAnchorEl(null))} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:eye' fontSize={20} />
            View
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

const QMSList = () => {
  // ** State
  const [qms, setQms] = useState<null | number>(null)
  const [drawerOpenClose, setDrawerOpenClose] = useState<boolean>(false)
  const [getViewReplyOpenClose, setViewReplyOpenClose] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Fetch QMS data using React Queries
  const { data } = useQuery({ queryKey: ['fetchQms'], queryFn: fetchQms })
  const qmsData = useMemo(() => {
    if (data?.data) {
      return data.data
    } else {
      return []
    }
  }, [data?.data])

  // console.log('qmsData', qmsData)

  const handleCloseViewReply = useCallback(() => {
    setViewReplyOpenClose(false)
  }, [setViewReplyOpenClose])

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      field: 'full_name',
      headerName: 'Name',
      renderCell: ({ row }: CellType) => {
        const { first_name, last_name, username, email } = row.user

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row.user)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography noWrap>{username ?? `${first_name} ${last_name}`}</Typography>
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
      field: 'user_type',
      headerName: 'User Type',
      renderCell: ({ row }: CellType) => {
        const { user_type } = row.user

        return (
          <Box key={row.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary'
                }}
              >
                {user_type || 'Client'}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'query',
      headerName: 'Subject',
      renderCell: ({ row }: CellType) => {
        const { query } = row

        return (
          <Box key={row.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary'
                }}
              >
                {query}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'answer',
      headerName: 'Query',
      renderCell: ({ row }: CellType) => {
        const { answer } = row

        return (
          <Box key={row.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary'
                }}
              >
                {answer}
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
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={row.status === 'active' ? 'Active' : 'Closed'}
            color={statusObj[row.status]}
            sx={{
              textTransform: 'capitalize',
              cursor: 'pointer'
            }}
          />
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
          status={row.status}
          toggleMode={() => (setDrawerOpenClose(true), setQms(row.id))}
          handleOpenViewReply={() => (setViewReplyOpenClose(true), setQms(row.id))}
        />
      )
    }
  ]

  const toggleAddEditDrawer = () => setDrawerOpenClose(!drawerOpenClose)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Manage QMS (Help & Support Reply)' className='secondaryDesign' />
          <Divider sx={{ m: '0 !important' }} />
          <DataGrid
            autoHeight
            getRowId={row => row.id}
            rowHeight={62}
            rows={qmsData}
            columns={columns}
            disableRowSelectionOnClick
            hideFooterPagination
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      {drawerOpenClose && <AddEditDrawer open={drawerOpenClose} toggle={() => toggleAddEditDrawer()} id={qms} />}
      {getViewReplyOpenClose && (
        <ViewQMSDrawer open={getViewReplyOpenClose} toggle={() => handleCloseViewReply()} id={qms} />
      )}
    </Grid>
  )
}

export default QMSList
