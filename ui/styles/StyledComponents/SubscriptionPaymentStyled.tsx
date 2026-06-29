import { fustat } from '@/mui-theme/_muiTheme';
import { Box, styled } from '@mui/material';

export const SubscriptionPaymentWrap = styled(Box)`
  min-height: 100vh;
  background: ${({ theme }) => theme.palette.customColors.bodyBg};
  padding: 70px 0;

  @media (max-width: 899px) {
    padding: 40px 0;
  }

  .checkoutGrid {
    align-items: flex-start;
  }

  .checkoutPanel {
    background: ${({ theme }) => theme.palette.common.white};
    border-radius: 16px;
    box-shadow: 0px 14px 104px 0px rgba(238, 246, 234, 0.7);
    padding: 32px;

    @media (max-width: 599px) {
      border-radius: 12px;
      padding: 22px 16px;
    }
  }

  .planSummary {
    position: sticky;
    top: 24px;

    @media (max-width: 899px) {
      position: static;
    }
  }

  .summaryLabel,
  .formHint,
  .fieldLabel {
    font-family: ${fustat.style.fontFamily};
    color: ${({ theme }) => theme.palette.customColors.dark};
  }

  .summaryLabel {
    font-size: 14px;
    margin-bottom: 8px;
  }

  .planTitle,
  .sectionTitle {
    font-family: ${fustat.style.fontFamily};
    font-weight: 700;
    color: ${({ theme }) => theme.palette.customColors.light};
  }

  .planTitle {
    font-size: 28px;
    margin-bottom: 10px;
  }

  .planDescription {
    font-family: ${fustat.style.fontFamily};
    font-size: 14px;
    line-height: 1.55;
    color: ${({ theme }) => theme.palette.customColors.dark};
  }

  .priceBlock {
    border-top: 1px solid ${({ theme }) => theme.palette.grey[200]};
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[200]};
    margin: 24px 0;
    padding: 20px 0;
  }

  .priceText {
    font-family: ${fustat.style.fontFamily};
    font-weight: 700;
    font-size: 34px;
    color: ${({ theme }) => theme.palette.primary.main};
  }

  .billingCycle {
    font-family: ${fustat.style.fontFamily};
    font-size: 15px;
    color: ${({ theme }) => theme.palette.customColors.dark};
  }

  .featureList {
    li {
      position: relative;
      padding-left: 24px;
      font-family: ${fustat.style.fontFamily};
      font-size: 14px;
      color: ${({ theme }) => theme.palette.customColors.dark};

      &:not(:last-child) {
        margin-bottom: 14px;
      }

      &::before {
        content: '';
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: ${({ theme }) => theme.palette.primary.main};
        position: absolute;
        left: 0;
        top: 8px;
      }
    }
  }

  .sectionTitle {
    font-size: 26px;
    margin-bottom: 8px;
  }

  .formHint {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .paymentTabs {
    min-height: 46px;
    margin-bottom: 24px;

    .MuiTabs-indicator {
      display: none;
    }

    .MuiTabs-flexContainer {
      gap: 10px;
      flex-wrap: wrap;
    }

    .MuiTab-root {
      min-height: 46px;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.palette.grey[200]};
      color: ${({ theme }) => theme.palette.customColors.dark};
      font-family: ${fustat.style.fontFamily};
      font-weight: 600;
      text-transform: capitalize;
      padding: 10px 18px;

      &.Mui-selected {
        background: ${({ theme }) => theme.palette.primary.main};
        color: ${({ theme }) => theme.palette.common.white};
        border-color: ${({ theme }) => theme.palette.primary.main};
      }
    }
  }

  .paymentForm {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .fieldLabel {
    display: block;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .errorCls {
    display: block;
    margin-top: 6px;
  }

  .fieldHelperText {
    display: block;
    margin-top: 6px;
    font-family: ${fustat.style.fontFamily};
    color: ${({ theme }) => theme.palette.customColors.light};
    opacity: 0.82;
  }

  .paymentNotice {
    border-radius: 8px;
    background: rgba(66, 124, 54, 0.08);
    padding: 12px 14px;
    font-family: ${fustat.style.fontFamily};
    font-size: 13px;
    color: ${({ theme }) => theme.palette.customColors.light};
  }

  .paymentResponseCard {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    border: 1px solid rgba(66, 124, 54, 0.16);
    border-radius: 14px;
    background: rgba(66, 124, 54, 0.06);
    padding: 16px;

    &.failed {
      border-color: rgba(211, 47, 47, 0.22);
      background: rgba(211, 47, 47, 0.06);
    }

    &.pending {
      border-color: rgba(237, 108, 2, 0.22);
      background: rgba(237, 108, 2, 0.06);
    }
  }

  .paymentResponseIcon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.common.white};
    color: ${({ theme }) => theme.palette.customColors.light};
    font-family: ${fustat.style.fontFamily};
    font-weight: 800;
    box-shadow: 0 10px 28px rgba(66, 124, 54, 0.12);

    svg {
      width: 28px;
      height: 28px;
    }
  }

  .paymentResponseTitle {
    font-family: ${fustat.style.fontFamily};
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.palette.customColors.light};
    margin-bottom: 4px;
  }

  .paymentResponseText,
  .paymentResponseRef,
  .paymentStatusText,
  .paymentFailedText {
    font-family: ${fustat.style.fontFamily};
    font-size: 13px;
  }

  .paymentResponseText {
    color: ${({ theme }) => theme.palette.customColors.dark};
  }

  .paymentResponseRef {
    color: ${({ theme }) => theme.palette.customColors.light};
    font-weight: 600;
    margin-top: 6px;
    word-break: break-all;
  }

  .paymentStatusText {
    color: ${({ theme }) => theme.palette.customColors.light};
    font-weight: 600;
  }

  .paymentFailedText {
    color: ${({ theme }) => theme.palette.error.main};
    font-weight: 600;
  }

  .stripeElementBox {
    border: 1px solid ${({ theme }) => theme.palette.customColors.borderColor};
    border-radius: 10px;
    padding: 15px 16px 15px 20px;
    background: ${({ theme }) => theme.palette.common.white};
    transition: border-color 0.2s ease;

    &.StripeElement--focus {
      border-color: ${({ theme }) => theme.palette.primary.main};
    }

    &.StripeElement--invalid {
      border-color: ${({ theme }) => theme.palette.error.main};
    }
  }

  .stripeCardGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .activeSubscriptionPanel {
    text-align: center;
    max-width: 680px;
    margin: 0 auto;

    .paymentNotice {
      margin-top: 20px;
    }
  }

  .activeSubscriptionIcon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
  }

  .validationStatePanel {
    max-width: 640px;
    margin: 0 auto;
    text-align: center;

    > .MuiBox-root {
      justify-content: center;
      margin-bottom: 18px;
    }
  }

  .payBtn {
    height: 50px;
    border-radius: 6px;
    font-family: ${fustat.style.fontFamily};
    font-weight: 600;
    font-size: 16px;
    text-transform: capitalize;
    margin-top: 4px;
    gap: 8px;
  }

  @media (max-width: 575px) {
    .stripeCardGrid {
      grid-template-columns: 1fr;
    }
  }
`;
