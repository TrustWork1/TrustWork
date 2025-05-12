import styled from '@emotion/styled';
import Box from '@mui/material/Box';

import Stack, { StackProps } from '@mui/material/Stack';
import React, { useCallback, useState } from 'react';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import DashboardSidebar from '../DashboardSidebar/DashboardSidebar';

interface dashBoardProps extends StackProps {
  headerTitle: string;
}

const DashboardWrapper: React.FC<dashBoardProps & StackProps> = ({ headerTitle, ...props }) => {
  const [getHeaderHeight, setGetHeaderHeight] = useState<number>(0);

  const headerHeightCallBack = useCallback((data: number) => {
    setGetHeaderHeight(data);
  }, []);

  return (
    <DashboardWrapperStyled
      headerHeight={getHeaderHeight}
      direction='row'
      flexWrap='wrap'
      {...props}
    >
      <DashboardSidebar />
      <Box className='wrapper_rgt'>
        <DashboardHeader headerTitle={headerTitle} headerHeightCallBack={headerHeightCallBack} />
        <Box className='dashboard_body'>{props?.children}</Box>
      </Box>
    </DashboardWrapperStyled>
  );
};

export default DashboardWrapper;

export const DashboardWrapperStyled = styled(Stack, {
  shouldForwardProp: data => data !== 'headerHeight',
})<{ headerHeight: number }>`
  padding: 20px 20px;
  height: 100vh;
  .wrapper_rgt {
    width: calc(100% - 237px);
    flex-basis: calc(100% - 237px);
    padding-left: 30px;
    padding-top: ${({ headerHeight }) => `${headerHeight}px`};
    margin-left: auto;
  }
  .dashboard_body {
    padding: 30px 30px;

    border-radius: 20px;
    height: calc(100vh - (40px + ${({ headerHeight }) => `${headerHeight}px`}));
    overflow-y: auto;
  }
  .common_box {
    padding: 16px 20px;
    border-radius: 10px;
  }
`;
