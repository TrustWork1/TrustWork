import { figtree } from '@/mui-theme/_muiTheme';
import { Box, styled } from '@mui/material';

export const BillingToggleWrap = styled(Box)`
  .labelPara {
    font-family: ${figtree.style.fontFamily};
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.palette.customColors.color5F616D};

    &.active {
      font-weight: 600;
      color: ${({ theme }) => theme.palette.customColors.color020512};
    }
  }

  .MuiSwitch-root {
    padding: 0;
    width: 65px;
    height: 36px;
    border-radius: 50px;
    .MuiSwitch-switchBase {
      padding: 0;
      top: 4px;
      left: 4px;

      &.Mui-checked {
        transform: translateX(28px);
        + .MuiSwitch-track {
          background: ${({ theme }) => theme.palette.customColors.colorD1E9C4};
          opacity: 1;
        }
      }

      .MuiSwitch-thumb {
        width: 28px;
        height: 28px;
        background: ${({ theme }) => theme.palette.primary.main};
      }
    }

    .MuiSwitch-track {
      background: ${({ theme }) => theme.palette.customColors.colorD1E9C4};
      opacity: 1;
    }
  }
`;
