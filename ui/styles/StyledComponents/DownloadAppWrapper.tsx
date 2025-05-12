import assest from '@/json/assest';
import { Box, styled } from '@mui/material';

export const DownloadAppWrapper = styled(Box)`
  position: relative;
  padding-top: 100px;

  @media (max-width: 1199px) {
    padding-top: 50px;
  }

  .download-banner-content {
    @media (max-width: 1199px) {
      text-align: center;
    }
  }

  .pageContent {
    padding: 0 85px;
    background: url(${assest.downloadAppBG}) no-repeat;
    border-radius: 20px;

    @media (max-width: 1199px) {
      padding: 50px 15px;
    }

    .pageHeading {
      padding-bottom: 24px;

      h2 {
        @media (max-width: 1199px) {
          font-size: 48px;
          margin-bottom: 15px;
        }

        @media (max-width: 599px) {
          font-size: 32px;
        }
      }

      p {
        @media (max-width: 1199px) {
          max-width: 560px;
          margin: 0 auto;
        }
      }
    }

    .iphoneImg {
      margin-top: -58px;
      line-height: 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .MuiButtonGroup-root {
      border-radius: 52px;
      gap: 30px;
      button {
        border: none;
        margin: 0;
        padding: 0;

        img {
          @media (max-width: 1199px) {
            width: 140px;
          }
        }

        &:hover {
          background-color: transparent;
        }
      }
    }
  }
`;
