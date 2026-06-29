import { TSubscriptionCheckoutPlan } from '@/typescript/types/subscriptionPayment.type';
import { Box, List, ListItem, Typography } from '@mui/material';

const SubscriptionPlanSummary = ({ plan }: { plan: TSubscriptionCheckoutPlan }) => {
  return (
    <Box className='checkoutPanel planSummary'>
      <Typography variant='body1' className='summaryLabel'>
        Subscription plan
      </Typography>
      <Typography variant='h1' className='planTitle'>
        {plan.planName}
      </Typography>
      <Typography variant='body1' className='planDescription'>
        {plan.description}
      </Typography>
      <Box className='priceBlock'>
        <Typography variant='body1' className='priceText'>
          XAF {plan.amount}
        </Typography>
        <Typography variant='body1' className='billingCycle'>
          /{plan.billingCycle}
        </Typography>
      </Box>
      <List disablePadding className='featureList'>
        {plan.features.map(feature => (
          <ListItem disablePadding key={feature}>
            {feature}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SubscriptionPlanSummary;
