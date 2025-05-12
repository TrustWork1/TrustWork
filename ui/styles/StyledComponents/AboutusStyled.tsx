import assest from '@/json/assest';
import { Box, styled } from '@mui/material';

export const AboutUsInner = styled(Box)``;
export const KnowMoreAboutWrap = styled(Box)`
  padding: 100px 0;
  padding-bottom: 50px;

  @media (max-width: 899px) {
    padding-top: 50px;
  }

  .know-right {
    max-width: 538px;
    margin-left: auto;
    width: 100%;

    @media (max-width: 1199px) {
      max-width: 100%;
    }

    @media (max-width: 899px) {
      padding-top: 50px;
    }

    .lg-mask {
      mask-image: url(${assest.aboutMaskLg});
      mask-repeat: no-repeat;
      height: 585px;

      @media (max-width: 1199px) {
        height: 435px;
        mask-size: 100% 100%;
      }

      @media (max-width: 899px) {
        height: 585px;
      }

      @media (max-width: 599px) {
        height: 355px;
      }

      img {
        height: 100%;
        object-fit: cover;
      }
    }

    .float-box {
      position: absolute;
      left: -20px;
      bottom: -40px;
      max-width: 243px;
      width: 100%;

      @media (max-width: 1199px) {
        left: -10px;
      }

      @media (max-width: 599px) {
        max-width: 153px;
      }

      .overlay-hexa {
        position: relative;
        z-index: 1;
        filter: drop-shadow(0px 14px 54px #3e7d193b);
      }

      .sm-mask {
        mask-image: url(${assest.aboutMaskSm});
        mask-repeat: no-repeat;
        height: 236px;
        position: absolute;
        z-index: 2;
        max-width: 216px;
        width: 100%;
        left: 14px;
        top: 15px;

        @media (max-width: 599px) {
          height: 147px;
          max-width: 133px;
          left: 10px;
          top: 10px;
          mask-size: 100% 100%;
        }

        img {
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  .sec-heading {
    max-width: 482px;
    width: 100%;
  }
`;

export const WhyUsWrap = styled(Box)`
  padding-top: 100px;

  @media (max-width: 899px) {
    padding-top: 50px;

    .MuiContainer-root {
      position: relative;
      z-index: 8;
    }
  }

  .about-float-left {
    position: absolute;
    left: 0;
    top: 9%;
  }

  .about-float-right {
    position: absolute;
    right: 0;
    top: -7%;
  }

  .headerSection {
    max-width: 644px;
    margin: auto;

    @media (max-width: 1199px) {
      margin-bottom: 40px;
    }
  }

  .bottom-sahpe {
    position: relative;
    width: 100%;
    margin-top: -140px;

    @media (max-width: 599px) {
      margin-top: -200px;
    }

    img {
      width: 100%;
      position: relative;
      z-index: 6;
      height: 253px;
    }
  }

  .big-text {
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    font-weight: 800;
    font-size: 16.45vw;
    line-height: 1.1;
    background: linear-gradient(181.08deg, rgba(237, 241, 245, 0.69) -6.74%, #ffffff 113.74%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    margin-top: -45px;
    z-index: 7;
    position: relative;
    overflow: hidden;
  }

  .whyus-head {
    padding-bottom: 60px;
  }

  .column-cont {
    .whyus-card {
      padding-bottom: 68px;
      margin-bottom: 81px;
      border-bottom: 1px solid #edf9e5;
      &:last-child {
        padding-bottom: 0;
        margin-bottom: 0;
        border-bottom: 0;
      }

      @media (max-width: 899px) {
        padding-bottom: 30px;
        margin-bottom: 30px;
      }

      @media (max-width: 599px) {
        border-bottom: none;
        padding-bottom: 10px;
        margin-bottom: 20px;
        max-width: 100%;

        &:last-child {
          padding-bottom: 10px;
          margin-bottom: 20px;
          border-bottom: 0;
        }
      }
    }
  }

  .imageArrangement {
    width: 100%;
    min-height: 799px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 305px;
      height: 305px;
      border-radius: 50%;
      background: #4b991e;
      filter: blur(84px);
    }

    .outerStar {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .imageText {
      font-size: 161px;
      font-weight: 800;
      position: relative;
      z-index: 5;
      background: -webkit-linear-gradient(
        270deg,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(255, 255, 255, 0) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
      line-height: 180px;

      @media (max-width: 1199px) {
        font-size: 125px;
      }
    }
    .innerStar {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 528px;
      width: 100%;
    }
    .centerEllipse {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 644px;
      width: 100%;
    }
    .phoneHolding {
      position: absolute;
      top: 14%;
      left: 50%;
      transform: translate(-50%, 0%);
      z-index: 6;
      height: 100%;
      width: auto;

      @media (max-width: 1199px) {
        object-fit: cover;
      }
    }
  }
`;
