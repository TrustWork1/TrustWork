import { Box, styled } from '@mui/material';

export const OurFeaturesWrapper = styled(Box)`
  position: relative;
  z-index: 1;
  .pageHeading {
    padding-bottom: 40px;

    @media (max-width: 599px) {
      padding-bottom: 25px;
    }
  }
`;
