import { Box, styled } from '@mui/material';

export const HowItWorksWrapper = styled(Box)`
  position: relative;
  .howItWorks_FloatShape {
    position: absolute;
    top: -130px;
    right: 0px;
  }
  .pageHeading {
    padding-bottom: 45px;
  }
  .work_card_list {
    &:not(:last-child) {
      margin-bottom: 28px;
    }
  }

  .rgt-part {
    @media (max-width: 899px) {
      margin-top: 50px;
    }
  }

  .how-it-fig {
    @media (max-width: 899px) {
      max-width: 50%;
      margin: 0 auto;
    }
  }
`;
