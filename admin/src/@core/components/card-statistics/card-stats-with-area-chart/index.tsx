/* eslint-disable @typescript-eslint/no-unused-vars */
// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Type Imports
import { ApexOptions } from 'apexcharts'
import { CardStatsWithAreaChartProps } from 'src/@core/components/card-statistics/types'

// ** Custom Component Imports
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { Box, CardHeader } from '@mui/material'
import OptionsMenu from '../../option-menu'

const CardStatsWithAreaChart = (props: CardStatsWithAreaChartProps) => {
  // ** Props
  const {
    sx,
    title,
    avatarIcon,
    chartSeries,
    avatarSize = 42,
    chartColor = 'primary',
    avatarColor = 'primary',
    avatarIconSize = '1.625rem',
    cardData,
  } = props

  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 2.5,
      curve: 'smooth'
    },
    grid: {
      show: false,
      padding: {
        top: 2,
        bottom: 17
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0,
        opacityFrom: 1,
        shadeIntensity: 1,
        stops: [0, 100],
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.4,
              color: theme.palette[chartColor].main
            },
            {
              offset: 100,
              opacity: 0.1,
              color: theme.palette.background.paper
            }
          ]
        ]
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: theme.palette[chartColor].main
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false }
  }

  return (
    <Card sx={{ ...sx }}>
       <CardHeader
        sx={{ pb: 0 }}
        title={title}
        action={
          <OptionsMenu
            options={['Today', 'Yesterday ', 'Last Week' ,'Current Month', "Last Month"]}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'flex', alignItems: "flex-start" }}>
        <CustomAvatar skin='light' color={avatarColor} sx={{ mb: 2.5, width: avatarSize, height: avatarSize }}>
          <Icon icon={avatarIcon} fontSize={avatarIconSize} />
        </CustomAvatar>
        <Box sx={{display:'flex', alignItems:"flex-start" ,flexDirection:'column',width:'100%', ml:4}}>
          <Box>


        { cardData && cardData.map((data)=>(
           <Typography key={data.title} variant='body2'>{data.title} : {data.value}</Typography>
        ))}
          </Box>

        </Box>

      </CardContent>
      {/* <ReactApexcharts type='area' height={110} options={options} series={chartSeries} /> */}
    </Card>
  )
}

export default CardStatsWithAreaChart
