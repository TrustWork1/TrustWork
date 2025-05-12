// ** MUI Import
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useQuery } from '@tanstack/react-query'

// ** Demo Component Imports
// import AnalyticsProject from 'src/views/dashboards/analytics/AnalyticsProject'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { listOfUniqueKeys } from 'src/lib/listOfUniqueKeys'
import { dashboardDetailFetchFn } from 'src/services/functions/dashboard.api'

// import EcommerceCongratulationsJohn from 'src/views/dashboards/ecommerce/EcommerceCongratulationsJohn'
import EcommerceStatistics from 'src/views/dashboards/ecommerce/EcommerceStatistics'

const AnalyticsDashboard = () => {
  const { data: dashboardDetails, isLoading } = useQuery({
    queryKey: [listOfUniqueKeys.dashboard.list],
    queryFn: dashboardDetailFetchFn,
    select(data) {
      return data?.data
    }
  })

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6}>
          {/* <Grid item xs={12} md={4}>
            <EcommerceCongratulationsJohn />
          </Grid> */}
          <Grid item xs={12}>
            {isLoading ? (
              <Typography variant='subtitle2'>Loading Dashboard Analytics...</Typography>
            ) : (
              <EcommerceStatistics dashboardDetails={dashboardDetails} />
            )}
          </Grid>
          {/* <Grid item xs={12} lg={12}>
            <AnalyticsProject />
          </Grid> */}
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
