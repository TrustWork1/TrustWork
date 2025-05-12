import { InnerBannerSec } from '@/styles/StyledComponents/InnerBannerStyled';
import { BoxProps, Container, Typography } from '@mui/material';
import React from 'react';

interface IBannerInnerProps extends BoxProps {
  heading: string;
  subTitle: string;
}

const InnerBanner: React.FC<IBannerInnerProps> = ({ heading, subTitle, ...props }) => {
  return (
    <InnerBannerSec {...props} sx={{ textAlign: 'center' }}>
      <Container fixed>
        <Typography variant='h1'>{heading}</Typography>
        <Typography variant='body2'>{subTitle}</Typography>
      </Container>
    </InnerBannerSec>
  );
};

export default InnerBanner;
