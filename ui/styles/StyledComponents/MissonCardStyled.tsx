import { Box, styled } from '@mui/material';

export const MissonCardWrap = styled(Box)`
  margin-bottom: 65px;

  @media (max-width: 1199px) {
    margin-bottom: 35px;
  }

  @media (max-width: 599px) {
    &:last-child {
      margin-bottom: 0px;
    }
  }

  h2 {
    color: ${({ theme }) => theme.palette.common?.black};
    margin-bottom: 8px;

    @media (max-width: 1199px) {
      font-size: 30px;
    }

    @media (max-width: 599px) {
      font-size: 24px;
    }
  }
`;
