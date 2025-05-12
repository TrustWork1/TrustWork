import { Box, styled } from '@mui/material';

export const ContactUsInner = styled(Box)``;
export const ContactUsDeatailsWrap = styled(Box)`
  position: relative;

  .contact-top-sec {
    position: relative;
    padding-top: 100px;
    padding-bottom: 50px;

    @media (max-width: 1199px) {
      padding-top: 50px;
      padding-bottom: 0;
    }

    @media (max-width: 599px) {
      padding-top: 20px;
    }

    .sec-heading {
      max-width: 482px;
      width: 100%;
      margin-bottom: 50px;

      @media (max-width: 599px) {
        margin-bottom: 30px;
      }

      h2 {
        text-transform: capitalize;
        max-width: 439px;

        @media (max-width: 899px) {
          max-width: 100%;
        }

        @media (max-width: 599px) {
          font-size: 16px;
          margin-bottom: 10px;
        }
      }

      p {
        @media (max-width: 599px) {
          font-size: 14px;
        }
      }
    }

    .float-right-bg {
      position: absolute;
      right: 0;
      bottom: 0;
    }

    .getin-box {
      h6 {
        margin-bottom: 10px;

        @media (max-width: 599px) {
          font-size: 16px;
          margin-bottom: 5px;
        }
      }

      p {
        @media (max-width: 599px) {
          font-size: 14px;
        }
      }

      a {
        color: ${({ theme }) => theme.palette.customColors.dark};
      }
    }

    .social-media-links {
      .logo-container {
        a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: ${({ theme }) => theme.palette.primary.main};
          border-radius: 50%;
          width: 31px;
          height: 31px;
          border: 1px solid ${({ theme }) => theme.palette.primary.main};
          transition: all 0.3s ease;

          &:hover {
            background-color: ${({ theme }) => theme.palette.common.white};
            transform: rotate(360deg);

            svg {
              path {
                fill: ${({ theme }) => theme.palette.primary.main};
              }
            }
          }
        }
      }
    }
  }

  .form-container {
    padding: 50px;
    box-shadow: 0px 14px 104px 0px #eef6ea80;
    border-radius: 16px;
    position: relative;
    z-index: 1;

    @media (max-width: 1199px) {
      padding: 40px;
    }

    @media (max-width: 899px) {
      padding: 20px;
    }

    h6 {
      font-size: 20px;
    }

    .send-Btn {
    }
  }

  .map-area {
    position: relative;

    .float-left-bg {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
    }
    .float-right-bg-map {
      position: absolute;
      right: 220px;
      bottom: -5px;
      z-index: 1;
    }
    .map-section {
      position: relative;
      z-index: 2;
      iframe{
        width: 100%;
      }
      img {
        width: 100%;
        object-fit: cover;
      }
    }
  }
`;
