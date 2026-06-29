import assest from '@/json/assest';
import { Paper, styled } from '@mui/material';

export const PricingCardPaper = styled(Paper)`
  box-shadow: 0px 4px 44px #eef6ea;
  border-radius: 16px;
  padding: 50px 38px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;

  .plant-top {
    width: 100%;
  }

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

  .selectPlanBtn {
    height: 50px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 16px;
    text-transform: capitalize;
    box-shadow: 0px 14px 25px 0px rgba(66, 124, 54, 0.2);

    @media (max-width: 599px) {
      height: 46px;
      font-size: 14px;
    }
  }
`;
