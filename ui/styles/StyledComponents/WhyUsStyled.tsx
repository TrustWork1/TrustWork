import { Box, styled } from '@mui/system';

export const WhyUsCard = styled(Box)`
  max-width: 260px;

  i {
    display: inline-block;
    width: 42px;
    height: 42px;
    margin-bottom: 27px;

    @media (max-width: 599px) {
      margin-bottom: 15px;
    }

    svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  h3 {
    margin-bottom: 20px;
    max-width: 231px;

    @media (max-width: 1199px) {
      max-width: 100%;
      font-size: 22px;
    }

    @media (max-width: 899px) {
      font-size: 17px;
      margin-bottom: 12px;
    }

    @media (max-width: 599px) {
      margin-bottom: 10px;
    }
  }
`;
