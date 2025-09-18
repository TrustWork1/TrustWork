import assest from '@/json/assest';
import { fustat } from '@/mui-theme/_muiTheme';
import { Box, styled } from '@mui/material';

export const SubscriptionUIWrap = styled(Box)`
  padding-top: 100px;
  position: relative;
  @media (max-width: 1199px) {
    padding-top: 80px;
  }
  @media (max-width: 899px) {
    padding-top: 60px;
  }
  @media (max-width: 599px) {
    padding-top: 40px;
  }
  .greyBg {
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }
  .subCards {
    margin-top: 40px;

    @media (max-width: 899px) {
      margin-top: 30px;
    }
    @media (max-width: 599px) {
      margin-top: 20px;
    }
  }

  .float-right-bg-one {
    position: absolute;
    z-index: -1;
    right: 0;
    top: 55px;
  }

  .float-right-bg-two-privacy {
    position: absolute;
    z-index: -1;
    right: 0;
    top: 32%;
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

  .subHead {
    text-align: center;

    .secHead {
      font-family: ${fustat.style.fontFamily};
      font-weight: 700;
      font-size: 48px;
      text-transform: capitalize;
      color: ${({ theme }) => theme.palette.customColors.light};
      margin-bottom: 20px;

      @media (max-width: 1199px) {
        font-size: 38px;
      }
      @media (max-width: 899px) {
        font-size: 28px;
        margin-bottom: 10px;
      }
      @media (max-width: 599px) {
        font-size: 20px;
      }
    }

    .secSubtext {
      max-width: 636px;
      margin: 0 auto;
      font-family: ${fustat.style.fontFamily};
      font-weight: 400;
      font-size: 16px;
      text-align: center;
      color: ${({ theme }) => theme.palette.customColors.dark};
      @media (max-width: 599px) {
        font-size: 14px;
      }
    }
  }

  .toggleBlk {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 28px;
    @media (max-width: 599px) {
      margin-top: 18px;
    }
  }
`;
export const SubscriptionCardWrap = styled(Box)`
  background: ${({ theme }) => theme.palette.common.white};
  border-radius: 16px;
  padding: 40px 32px 32px;
  box-shadow: 0px 14px 104px 0px rgba(238, 246, 234, 0.502);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 30px;
  position: relative;
  height: 100%;

  @media (max-width: 899px) {
    padding: 30px 20px 20px;
  }
  @media (max-width: 599px) {
    padding: 20px 15px 15px;
    border-radius: 12px;
  }

  .popularChip {
    display: inline-block;
    position: absolute;
    background: ${({ theme }) => theme.palette.customColors.light};
    padding: 7px 15px;
    border-radius: 4px;
    box-shadow: 0px 14px 25px 0px rgba(66, 124, 54, 0.2);
    top: -12px;
    right: 15px;
    p {
      line-height: 1;
      font-family: ${fustat.style.fontFamily};
      font-weight: 400;
      font-size: 12px;

      color: ${({ theme }) => theme.palette.common.white};
    }
  }

  .basicPlanCard {
    .planTitle {
      font-family: ${fustat.style.fontFamily};
      font-weight: 700;
      font-size: 24px;
      text-transform: capitalize;
      color: ${({ theme }) => theme.palette.customColors.light};
    }

    .planSubtitle {
      font-family: ${fustat.style.fontFamily};
      font-weight: 400;
      font-size: 14px;
      color: ${({ theme }) => theme.palette.customColors.dark};
      margin: 10px 0;
    }

    .priceBlk {
      padding-bottom: 20px;
      border-bottom: 1px solid ${({ theme }) => theme.palette.grey[200]};
      .planPrice {
        font-family: ${fustat.style.fontFamily};
        font-weight: 600;
        color: ${({ theme }) => theme.palette.primary.main};
        font-size: 38px;
      }
      .planDuration {
        font-family: ${fustat.style.fontFamily};
        font-weight: 400;
        color: ${({ theme }) => theme.palette.customColors.dark};
        font-size: 16px;
      }
    }

    .planFeatures {
      margin-top: 20px;
      li {
        position: relative;
        padding-left: 25px;
        font-family: ${fustat.style.fontFamily};
        font-weight: 400;
        font-size: 14px;
        color: ${({ theme }) => theme.palette.customColors.dark};
        &:not(:last-child) {
          margin-bottom: 18px;
        }

        &::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 0;
          background: url(${assest.greenTickImg}) center no-repeat;
          width: 16px;
          height: 16px;
          background-size: 100% 100%;
        }
      }
    }
  }
`;
