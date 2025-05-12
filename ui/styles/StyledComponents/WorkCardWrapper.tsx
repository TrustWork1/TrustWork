import { Stack, styled } from '@mui/material';

export const WorkCardWrapper = styled(Stack)`
  background: ${({ theme }) => theme.palette.common.white};
  box-shadow: 0px 4px 44px #eef6ea;
  border-radius: 12px;
  padding: 20px 30px;

  @media (max-width: 1199px) {
    padding: 20px 15px;
  }

  .inner_left {
    width: 65%;

    @media (max-width: 1199px) {
      width: 80%;
    }

    i {
      line-height: 0;
      display: inline-block;
      width: 48px;
      height: 49px;

      @media (max-width: 1199px) {
        width: 30px;
        height: 30px;
      }

      svg {
        width: 100%;
        height: auto;
      }
    }
    .card_details_box {
      padding-left: 25px;
      width: calc(100% - 48px);

      @media (max-width: 1199px) {
        width: calc(100% - 30px);
        padding-left: 15px;
      }

      h3 {
        padding-bottom: 10px;

        @media (max-width: 1199px) {
          font-size: 18px;
          padding-bottom: 5px;
        }
      }
    }
  }

  h4 {
    width: 35%;
    text-align: right;
    font-size: 48px;
    display: inline-block;
    background: linear-gradient(180deg, #e3f3d9 0%, #ffffff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    @media (max-width: 1199px) {
      width: 20%;
    }
  }
`;
