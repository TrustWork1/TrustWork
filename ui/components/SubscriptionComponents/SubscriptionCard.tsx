import { formatPlanDuration } from '@/lib/functions/_helpers.lib';
import { SubscriptionCardWrap } from '@/styles/StyledComponents/SubscriptionCardWrap';
import { ISubscriptionCardProps } from '@/typescript/types/subscription.type';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import { Box, List, ListItem, Typography } from '@mui/material';
import { useState } from 'react';
import SubscriptionPlanFlow from './SubscriptionPlanFlow';

function SubscriptionCard({
  planId,
  planName,
  planSubTitle,
  price,
  features,
  isPopular,
}: ISubscriptionCardProps) {
  const [subscriptionFlowOpen, setSubscriptionFlowOpen] = useState(false);

  return (
    <SubscriptionCardWrap>
      {isPopular && (
        <Box className='popularChip'>
          <Typography variant='body1'>Most Popular</Typography>
        </Box>
      )}

      <Box className='basicPlanCard'>
        <Typography variant='body1' className='planTitle'>
          {planName}
        </Typography>
        <Typography variant='body1' className='planSubtitle'>
          {planSubTitle}
        </Typography>

        <Box display='flex' alignItems='baseline' className='priceBlk'>
          <Typography variant='body1' className='planPrice'>
            XAF {price}
          </Typography>
          <Typography variant='body1' className='planDuration'>
            /{formatPlanDuration(planName)}
          </Typography>
        </Box>

        <List className='planFeatures' disablePadding>
          {features.map((data, index) => (
            <ListItem key={index} disablePadding className='featureItem'>
              {data}
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
    </SubscriptionCardWrap>
  );
}

export default SubscriptionCard;
