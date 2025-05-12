import { PricingCardPaper } from '@/styles/StyledComponents/PricingCardStyled';
import { Box, List, ListItem, Typography } from '@mui/material';
import React from 'react';

export interface IPricingCard {
  planName: string;
  aboutPlan: string;
  price: number;
  billingCycle: string;
  features: string[];
}

const PricingCard: React.FC<IPricingCard> = ({
  planName,
  aboutPlan,
  price,
  billingCycle,
  features,
}) => {
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
          <span>${price}</span>/{billingCycle}
        </Typography>
        <List disablePadding>
          {features.map((feature, index) => (
            <ListItem disablePadding key={index}>
              {feature}
            </ListItem>
          ))}
        </List>
      </Box>
    </PricingCardPaper>
  );
};

export default PricingCard;
