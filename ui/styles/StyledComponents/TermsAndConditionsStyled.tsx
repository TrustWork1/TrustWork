import { Box, styled } from '@mui/material';

export const TermsAndCondInner = styled(Box)`
  padding-top: 70px;
  position: relative;

  .float-left-bg {
    position: absolute;
    z-index: -1;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .float-right-bg-one {
    position: absolute;
    z-index: -1;
    right: 0;
    top: 55px;
  }

  .float-right-bg-two {
    position: absolute;
    z-index: -1;
    right: 0;
    bottom: 18%;
  }

  .float-right-bg-two-privacy {
    position: absolute;
    z-index: -1;
    right: 0;
    top: 16%;
  }

  .float-left-bg-privacy {
    position: absolute;
    z-index: -1;
    left: 0;
    bottom: -5%;

    @media (max-width: 599px) {
      display: none;
    }
  }

  @media (max-width: 1199px) {
    padding-top: 40px;
  }

  @media (max-width: 899px) {
    padding-top: 30px;
  }

  @media (max-width: 599px) {
    padding-top: 10px;
  }

  h3 {
    font-size: 48px;
    font-weight: 700;
    margin: 30px 0 10px;

    @media (max-width: 899px) {
      font-size: 24px;
      margin: 15px 0 10px;
    }
  }
  p {
    margin-bottom: 10px;
  }
`;
