/* eslint-disable newline-before-return */

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { DashboardDataType } from '@/type/apps/dashboard'
import { useRouter } from 'next/router'

interface DataType {
  icon: string
  stats: string
  title: string
  route: string
  color: ThemeColor
}

type EcommerceStatisticsProps = {
  dashboardDetails: DashboardDataType | undefined
}

const EcommerceStatistics = ({ dashboardDetails }: EcommerceStatisticsProps) => {
  const router = useRouter()
  const renderStats = (dashbaordStatistics: DataType[]) => {
    return dashbaordStatistics?.map((sale: DataType, index: number) => (
      <Grid item xs={6} md={3} key={index}>
        <Box
          key={index}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => router.push(sale.route)}
        >
          <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
            <Icon icon={sale?.icon} fontSize='1.5rem' />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h5'>{sale?.stats}</Typography>
            <Typography variant='body2'>{sale?.title}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }
  const dashbaordStatistics: DataType[] = [
    {
      stats: dashboardDetails?.projects ? dashboardDetails?.projects?.toLocaleString() : '---',
      title: 'Projects',
      color: 'primary',
      route: '/dashboards/projects/list/',
      icon: 'tabler:chart-pie-2'
    },
    {
      stats: dashboardDetails?.clients ? dashboardDetails?.clients?.toLocaleString() : '---',
      color: 'info',
      title: 'Clients',
      route: '/dashboards/user/client/list/',
      icon: 'tabler:users'
    },
    {
      stats: dashboardDetails?.providers ? dashboardDetails?.providers?.toLocaleString() : '---',
      color: 'error',
      title: 'Service Providers',
      route: '/dashboards/user/provider/list/',
      icon: 'tabler:users'

      // icon: 'tabler:shopping-cart'
    },
    {
      stats: dashboardDetails?.total_transaction ? dashboardDetails?.total_transaction?.toLocaleString() : '---',
      color: 'success',
      title: 'Revenue',
      route: '/dashboards/transaction/list/',
      icon: 'tabler:currency-dollar'
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Statistics'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
        action={
          <Typography variant='body2' sx={{ color: 'text.disabled' }}>
            {/* Updated 1 month ago */}
          </Typography>
        }
      />
      <CardContent
        sx={{ pt: theme => `${theme.spacing(7)} !important`, pb: theme => `${theme.spacing(7.5)} !important` }}
      >
        <Grid container spacing={6}>
          {renderStats(dashbaordStatistics)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceStatistics
