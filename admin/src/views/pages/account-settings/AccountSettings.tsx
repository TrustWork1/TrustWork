// ** React Imports
import { ReactElement, useState, useEffect, SyntheticEvent } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types

// ** Demo Tabs Imports
import TabAccount from 'src/views/pages/account-settings/TabAccount'

// import TabBilling from 'src/views/pages/account-settings/TabBilling'
import TabSecurity from 'src/views/pages/account-settings/TabSecurity'

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  border: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 130
    },
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const AccountSettings = ({ tab }: { tab: string }) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // ** Hooks
  const router = useRouter()
  const hideText = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    router.push(`/pages/account-settings/${value.toLowerCase()}`).then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const tabContentList: { [key: string]: ReactElement } = {
    account: <TabAccount />,
    security: <TabSecurity />

    // connections: <TabConnections />,
    // notifications: <TabNotifications />,
    // billing: <TabBilling apiPricingPlanData={apiPricingPlanData} />
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TabList
                variant='scrollable'
                scrollButtons='auto'
                onChange={handleChange}
                aria-label='customized tabs example'
              >
                <Tab
                  value='account'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon fontSize='1.25rem' icon='tabler:users' />
                      {!hideText && 'Account'}
                    </Box>
                  }
                />
                <Tab
                  value='security'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon fontSize='1.25rem' icon='tabler:lock' />
                      {!hideText && 'Security'}
                    </Box>
                  }
                />
                {/* <Tab
                  value='billing'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon fontSize='1.25rem' icon='tabler:file-text' />
                      {!hideText && 'Billing'}
                    </Box>
                  }
                /> */}
                {/* <Tab
                  value='notifications'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon fontSize='1.25rem' icon='tabler:bell' />
                      {!hideText && 'Notifications'}
                    </Box>
                  }
                />
                <Tab
                  value='connections'
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                      <Icon fontSize='1.25rem' icon='tabler:link' />
                      {!hideText && 'Connections'}
                    </Box>
                  }
                /> */}
              </TabList>
            </Grid>
            <Grid item xs={12}>
              {isLoading ? (
                <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <CircularProgress sx={{ mb: 4 }} />
                  <Typography>Loading...</Typography>
                </Box>
              ) : (
                <TabPanel sx={{ p: 0 }} value={activeTab}>
                  {tabContentList[activeTab]}
                </TabPanel>
              )}
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default AccountSettings
