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
`;
