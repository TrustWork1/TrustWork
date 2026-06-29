import { PricingCardPaper } from '@/styles/StyledComponents/PricingCardStyled';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import { Box, List, ListItem, Typography } from '@mui/material';
import React, { useState } from 'react';
import SubscriptionPlanFlow from '../SubscriptionComponents/SubscriptionPlanFlow';

export interface IPricingCard {
  planId: number;
  planName: string;
  aboutPlan: string;
  price: number;
  billingCycle: string;
  features: string[];
}

const PricingCard: React.FC<IPricingCard> = ({
  planId,
  planName,
  aboutPlan,
  price,
  billingCycle,
  features,
}) => {
  const [subscriptionFlowOpen, setSubscriptionFlowOpen] = useState(false);

  return (
    <PricingCardPaper elevation={0}>
      <Box className='plant-top'>
        <Typography variant='h3' marginBottom={'10px'}>
          {planName}
        </Typography>
        <Typography variant='body1' marginBottom={'25px'}>
          {aboutPlan}
        </Typography>
        <Typography variant='body2'>
          <span>XAF {price}</span>/{billingCycle}
        </Typography>
        <List disablePadding>
          {features.map((feature, index) => (
            <ListItem disablePadding key={index}>
              {feature}
            </ListItem>
          ))}
        </List>
      </Box>
      <CustomButtonPrimary
        fullWidth
        variant='contained'
        color='primary'
        className='selectPlanBtn'
        onClick={() => setSubscriptionFlowOpen(true)}
      >
        Get Subscription
      </CustomButtonPrimary>
      <SubscriptionPlanFlow
        open={subscriptionFlowOpen}
        onClose={() => setSubscriptionFlowOpen(false)}
        planId={planId}
        planName={planName}
        price={price}
      />
    </PricingCardPaper>
  );
};

export default PricingCard;
