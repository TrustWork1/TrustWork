import assest from '@/json/assest';
import { Paper, styled } from '@mui/material';

export const PricingCardPaper = styled(Paper)`
  box-shadow: 0px 4px 44px #eef6ea;
  border-radius: 16px;
  padding: 50px 38px;
  height: 100%;

  .MuiTypography-body2 {
    span {
      font-weight: 600;
      font-size: 38px;
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  ul {
    border-top: 1px solid ${({ theme }) => theme.palette.grey[200]};
    margin-top: 30px;
    padding-top: 30px;

    li {
      background: url(${assest.listTick}) no-repeat;
      background-size: 16px 16px;
      padding-left: 24px;
      font-size: 14px;

      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
  }
`;
