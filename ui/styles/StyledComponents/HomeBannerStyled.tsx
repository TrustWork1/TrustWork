import { Box, styled } from '@mui/material';

export const HomeBannerBox = styled(Box)`
  position: relative;

  @media (max-width: 599px) {
    padding-bottom: 30px;
  }

  .float-shape {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .MuiContainer-root {
    padding: 0 !important;
    max-width: 100%;

    .inner-contain {
      width: calc(100% - (50% - (1200px / 2)));
      margin-left: auto;
      padding-left: 30px;
      position: relative;
      z-index: 1;

      @media (max-width: 1199px) {
        width: 100%;
      }

      @media (max-width: 599px) {
        padding: 0 15px;
      }

      .banner-content {
        padding-top: 100px;

        .left-grid {
          width: 100%;
          max-width: 506px;

          @media (max-width: 899px) {
            max-width: 50%;
          }

          @media (max-width: 599px) {
            max-width: 100%;
            text-align: center;
          }

          .MuiChip-root {
            height: auto;
            background-color: ${({ theme }) => theme.palette.customColors.primary100};
            padding: 10px 22px;
            border-radius: 100px;
            margin-bottom: 5px;

            .MuiChip-label {
              padding: 0;
              font-size: 16px;
            }
          }

          h1 {
            margin-bottom: 15px;

            @media (max-width: 1199px) {
              font-size: 42px;
              margin-top: 20px;
            }

            @media (max-width: 899px) {
              font-size: 32px;
              margin: 10px 0;
            }
          }

          .MuiButtonGroup-root {
            border-radius: 0;
            gap: 15px;
            padding-top: 25px;

            @media (max-width: 899px) {
              padding-top: 15px;
            }

            button {
              border: none;
              margin: 0;
              padding: 0;

              img {
                @media (max-width: 1199px) {
                  width: 120px;
                }
              }

              &:hover {
                background-color: transparent;
              }
            }
          }
        }

        .right-grid {
          width: 100%;
          max-width: calc(100% - 506px);
          text-align: right;
          margin-top: -100px;

          @media (max-width: 899px) {
            max-width: 50%;
            margin-top: -84px;
          }

          @media (max-width: 599px) {
            max-width: 100%;
            display: none;
          }
        }
      }
    }
  }
`;
