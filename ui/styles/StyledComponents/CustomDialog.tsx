import { fustat } from '@/mui-theme/_muiTheme';
import { Dialog, styled } from '@mui/material';

export const CustomDialog = styled(Dialog)`
  .dialog-backdrop {
    background: #040c089c;
  }

  .MuiPaper-root {
    background-color: transparent;
    width: 100%;
    max-width: 495px;
    border-radius: 0;
    overflow: inherit;
    height: auto;
    max-height: 85vh;
    margin: 20px;
    box-shadow: none;

    .dialog-close-btn {
      background-color: ${({ theme }) => theme.palette.common.white};
      align-self: flex-end;
      padding: 7px;
      transition: all 0.2s ease-in-out;
      color: ${({ theme }) => theme.palette.customColors.light};
      &:hover {
        background: ${({ theme }) => theme.palette.primary.main};
        color: ${({ theme }) => theme.palette.common.white};
      }

      @media (max-width: 899px) {
        padding: 5px;
      }

      @media (max-width: 599px) {
        padding: 3px;
      }
    }

    .MuiDialogContent-root {
      box-shadow: 0px 4px 36.3px 0px #dadada40;
      background-color: ${({ theme }) => theme.palette.common.white};
      border-radius: 16px;
      margin-top: 10px;
      padding: 50px;

      @media (max-width: 899px) {
        padding: 40px 30px 25px;
      }
      @media (max-width: 599px) {
        padding: 30px 20px 20px;
        border-radius: 12px;
      }

      .modalHead {
        margin-bottom: 20px;
        h4 {
          font-family: ${fustat.style.fontFamily};
          font-weight: 600;
          font-size: 20px;
          color: ${({ theme }) => theme.palette.customColors.light};
          margin-bottom: 10px;
        }
        .subTitle {
          font-family: ${fustat.style.fontFamily};
          font-weight: 400;
          font-size: 16px;
          color: ${({ theme }) => theme.palette.customColors.dark};
        }
      }
    }
  }

  .sendBtn {
    max-width: 176px;
    width: 100%;
    height: 50px;
  }

  &.paymentSuccessModal {
    .MuiDialogContent-root {
      position: relative;

      .paymentSuccessLftImg {
        position: absolute;
        left: 50px;
        top: 30px;
        width: 100px;
      }
      .paymentSuccessRgtImg {
        position: absolute;
        right: 30px;
        top: 10px;
        width: 150px;
      }
    }
    .paymentSuccessInr {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .secHead {
        font-family: ${fustat.style.fontFamily};
        font-weight: 600;
        font-size: 20px;
        text-align: center;
        color: ${({ theme }) => theme.palette.customColors.light};
        margin: 15px 0 5px;
      }

      .secSubText {
        text-align: center;
        font-family: ${fustat.style.fontFamily};
        font-weight: 400;
        font-size: 16px;

        color: ${({ theme }) => theme.palette.customColors.dark};
      }
    }
  }

  &.paymentSuccessResponseModal {
    .MuiDialogContent-root {
      padding: 40px 30px;
    }
    .paymentSuccessInr {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;

      .successIconWrap {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
        svg {
          width: 100px;
          height: 90px;
        }
      }

      .statusIconWrap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        font-size: 40px;
        font-weight: 700;
        margin-bottom: 24px;

        &.failed {
          background-color: rgba(211, 47, 47, 0.1);
          color: ${({ theme }) => theme.palette.error.main};
        }

        &.pending {
          background-color: rgba(237, 108, 2, 0.1);
          color: ${({ theme }) => theme.palette.warning.main};
        }
      }

      .secHead {
        font-family: ${fustat.style.fontFamily};
        font-weight: 700;
        font-size: 24px;
        color: ${({ theme }) => theme.palette.customColors.light};
        margin-bottom: 12px;
      }

      .secSubText {
        font-family: ${fustat.style.fontFamily};
        font-weight: 400;
        font-size: 15px;
        line-height: 1.6;
        color: ${({ theme }) => theme.palette.customColors.dark};
        margin-bottom: 8px;
      }

      .referenceText {
        font-family: ${fustat.style.fontFamily};
        font-size: 13px;
        font-weight: 600;
        color: ${({ theme }) => theme.palette.customColors.light};
        margin-top: 10px;
        word-break: break-all;
      }
    }
  }

  &.subscriptionFlowModal {
    .MuiPaper-root {
      max-width: 455px;
    }

    .subscriptionFlowInr {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;

      .flowIcon,
      .successIcon {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: rgba(66, 124, 54, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${({ theme }) => theme.palette.customColors.light};
        margin-bottom: 4px;

        svg {
          width: 34px;
          height: 34px;
        }
      }

      .successIcon {
        background: rgba(176, 239, 143, 0.35);

        svg {
          width: 58px;
          height: 52px;
        }
      }

      .flowTitle {
        font-family: ${fustat.style.fontFamily};
        font-weight: 700;
        font-size: 22px;
        text-align: center;
        color: ${({ theme }) => theme.palette.customColors.light};
      }

      .flowSubText {
        font-family: ${fustat.style.fontFamily};
        font-weight: 400;
        font-size: 14px;
        line-height: 1.5;
        text-align: center;
        color: ${({ theme }) => theme.palette.customColors.dark};
        margin-bottom: 4px;
      }

      .flowBtn {
        width: 100%;
        height: 50px;
        margin-top: 4px;
        border-radius: 6px;
        font-family: ${fustat.style.fontFamily};
        font-weight: 600;
        text-transform: capitalize;
      }

      .errorCls {
        align-self: flex-start;
        margin-top: -10px;
      }

      .loginErrorAlert {
        width: 100%;
        align-items: center;
        border-radius: 6px;
        padding: 6px 12px;

        .MuiAlert-message {
          font-family: ${fustat.style.fontFamily};
          font-size: 13px;
          line-height: 1.4;
        }
      }

      .loginMetaRow {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-top: -4px;

        .MuiFormControlLabel-root {
          margin: 0;
        }

        .MuiFormControlLabel-label,
        a {
          font-family: ${fustat.style.fontFamily};
          font-size: 12px;
          color: ${({ theme }) => theme.palette.customColors.dark};
        }

        a {
          color: ${({ theme }) => theme.palette.customColors.light};
        }
      }

      .resendPasswordLink {
        align-self: center;
        font-family: ${fustat.style.fontFamily};
        font-weight: 600;
        font-size: 13px;
        color: ${({ theme }) => theme.palette.customColors.light};
      }

      .infoNote {
        width: 100%;
        border-radius: 8px;
        background: rgba(66, 124, 54, 0.08);
        padding: 12px 14px;

        p {
          font-family: ${fustat.style.fontFamily};
          font-size: 13px;
          text-align: center;
          color: ${({ theme }) => theme.palette.customColors.light};
        }
      }
    }
  }
`;
