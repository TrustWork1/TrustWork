import { Paper, styled } from '@mui/material';

export const OurFeatureCardWrapper = styled(Paper)`
  box-shadow: 0px 4px 44px #eef6ea;
  border-radius: 16px;
  padding: 37px 28px 45px;
  height: 100%;

  @media (max-width: 1199px) {
    padding: 20px 15px;
  }

  i {
    display: inline-block;
    line-height: 0;
    margin-bottom: 35px;

    @media (max-width: 1199px) {
      width: 30px;
      height: 30px;
      margin-bottom: 25px;
    }

    svg {
      @media (max-width: 1199px) {
        width: 100%;
        height: auto;
      }
    }
  }

  h3 {
    margin-bottom: 20px;

    @media (max-width: 1199px) {
      font-size: 18px;
      margin-bottom: 10px;
    }
  }

  p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
