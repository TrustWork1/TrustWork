import assest from '@/json/assest';
import { Box, styled } from '@mui/material';

export const InnerBannerSec = styled(Box)`
  background: url(${assest.innerBannerBg}) no-repeat;
  background-size: cover;
  padding-top: 76px;
  padding-bottom: 76px;

  @media (max-width: 1199px) {
    padding-top: 40px;
    padding-bottom: 40px;
  }

  h1 {
    padding-bottom: 10px;

    @media (max-width: 1199px) {
      font-size: 50px;
    }

    @media (max-width: 899px) {
      font-size: 24px;
    }
  }

  p {
    max-width: 556px;
    margin: 0 auto;
  }
`;
