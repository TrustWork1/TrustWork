import { Box, styled } from '@mui/material';

export const ReferFriendPaper = styled(Box)`
  padding-top: 60px;

  @media (max-width: 1199px) {
    padding-top: 20px;
  }

  @media (max-width: 899px) {
    padding-top: 0;
  }

  @media (max-width: 599px) {
    padding-top: 20px;
  }

  .refer-con {
    position: relative;

    .left-fig {
      width: 100%;
      max-width: 436px;
      position: absolute;
      left: 45px;
      bottom: -46px;
      z-index: 1;

      @media (max-width: 1199px) {
        max-width: 296px;
        bottom: -30px;
        z-index: 1;
      }

      @media (max-width: 899px) {
        position: inherit;
        left: inherit;
        bottom: inherit;
        max-width: 100%;
      }
    }
  }

  .inner-stack-root {
    padding: 0px 70px;
    box-shadow: 0px 4px 44px 0px #eef6ea;
    border-radius: 16px;
    justify-content: flex-end;
    background: ${({ theme }) => theme.palette.common.white};
    overflow: hidden;
    position: relative;

    @media (max-width: 899px) {
      padding: 0 40px;
    }

    @media (max-width: 599px) {
      padding: 0 15px;
    }

    &::before {
      content: '';
      position: absolute;
      width: 127px;
      height: 127px;
      background: #6ed234;
      filter: blur(132px);
      right: -60px;
      bottom: -70px;
    }

    &::after {
      content: '';
      position: absolute;
      width: 155px;
      height: 155px;
      background: #6ed234;
      filter: blur(82px);
      top: -150px;
      left: 20%;
    }
  }

  .right-fig {
    width: 50%;
    position: relative;
    z-index: 2;

    @media (max-width: 899px) {
      width: 100%;
      text-align: center;
    }

    .rgt-inner {
      max-width: 457px;
      width: 100%;
      padding: 100px 0;

      @media (max-width: 1199px) {
        padding: 40px 0;
      }

      h3 {
        font-weight: 700;
        font-size: 48px;

        @media (max-width: 599px) {
          font-size: 32px;
          margin-bottom: 8px;
        }
      }
    }
  }
`;
