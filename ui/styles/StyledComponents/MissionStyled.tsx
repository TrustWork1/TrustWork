import { Box, styled } from '@mui/material';

export const MissionWrapper = styled(Box)`
  position: relative;
  margin-top: -120px;
  z-index: 7;

  @media (max-width: 899px) {
    margin-top: -80px;
  }

  .mission-immage-wrap {
    img {
      transform: scale(1.18);

      @media (max-width: 599px) {
        transform: unset;
      }
    }
  }
`;
