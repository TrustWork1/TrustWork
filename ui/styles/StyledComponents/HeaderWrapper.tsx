import { Drawer, styled } from '@mui/material';
import Box from '@mui/material/Box';

export const HeaderWrap = styled(Box)`
  .MuiToolbar-root {
    min-height: auto;
    padding: 0;
    justify-content: space-between;
  }

  .headerLogo {
    width: 20%;
    line-height: 0;

    @media (max-width: 899px) {
      width: 110px;
    }
  }

  .navbar {
    gap: 0 40px;
    width: 55%;

    @media (max-width: 1199px) {
      gap: 0 15px;
    }

    li {
      width: auto;
    }

    a {
      color: ${({ theme }) => theme.palette.text.secondary};
      position: relative;

      &:hover,
      &.active {
        color: ${({ theme }) => theme.palette.primary.main};
      }

      .cus-badge {
        background-color: ${({ theme }) => theme.palette.secondary.main};
        font-size: 13px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 8px;
        margin-left: 12px;
      }
    }
  }

  .hdr_rgt {
    width: 16%;
    justify-content: flex-end;

    @media (max-width: 899px) {
      width: calc(100% - 110px);
      padding-left: 15px;
    }

    .MuiButton-contained {
      @media (max-width: 1199px) {
        font-size: 14px;
        padding: 10px;
      }
    }

    .menu-btn {
      color: ${({ theme }) => theme.palette.primary.main};
      margin-left: 10px;
    }
  }

  .headerContainer {
    background-color: ${({ theme }) => theme.palette.customColors.white600} !important;
    padding: 22px 0;
    transition: all 0.4s;
    backdrop-filter: blur(44px);
    z-index: 99;

    @media (max-width: 599px) {
      padding: 10px 0;
    }
  }
`;

export const HeaderDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    background-color: ${({ theme }) => theme.palette.primary.light};
    max-width: 240px;
    width: 100%;
  }
`;

export const DrawerContain = styled(Box)`
  .drw-logo {
    padding: 16px;
  }

  ul {
    li {
      a {
        color: ${({ theme }) => theme.palette.customColors.light};
      }
    }
  }
`;
