import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import DashboardWrapper from '@/layout/DashboardWrapper/DashboardWrapper';

export const HomeWrapper = styled(Box)``;

const Index = () => {
  return (
    <DashboardWrapper headerTitle='Dashboard'>
      <HomeWrapper>
        <Grid container spacing={3}></Grid>
      </HomeWrapper>
    </DashboardWrapper>
  );
};

export default Index;
