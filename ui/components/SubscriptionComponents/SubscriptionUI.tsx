import assest from '@/json/assest';
import { SubscriptionUIWrap } from '@/styles/StyledComponents/SubscriptionCardWrap';
import { ISubscriptionModel } from '@/typescript/interface/subscription.interfaces';
import { Box, Grid2, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import Image from 'next/image';
import { useMemo } from 'react';
import SubscriptionCard from './SubscriptionCard';

function SubscriptionUI({
  subscriptionPackageList,
  subscriptionCms,
}: {
  subscriptionPackageList: ISubscriptionModel['PricingPlanSection'];
  subscriptionCms: ISubscriptionModel['SubscriptionCmsSection'];
}) {
  const updatedSubscriptions = useMemo(() => {
    return subscriptionPackageList?.map(item => {
      return {
        planId: item?.id,
        planName: item?.plan_name,
        planSubTitle: item?.description,
        price: Number(item?.price),
        features: item?.features?.map(f => f.features) || [],
        isPopular: item?.is_popular ?? false,
      };
    });
  }, [subscriptionPackageList]);

  return (
    <SubscriptionUIWrap>
      <Image
        src={assest.starImage7}
        width={65}
        height={230}
        alt='starbg'
        className='float-right-bg-one'
      />
      <Image src={assest.greyBg} width={1045} height={30} alt='greyBg' className='greyBg' />
      <Image
        src={assest.starImage4}
        width={122}
        height={232}
        alt='starbg'
        className='float-right-bg-two-privacy'
      />
      <Image
        src={assest.starImage5}
        width={136}
        height={232}
        alt='starbg'
        className='float-left-bg-privacy'
      />
      <Container fixed>
        <Box className='subHead'>
          <Typography variant='h2' className='secHead'>
            {subscriptionCms?.header}
          </Typography>
          <Typography variant='body1' className='secSubtext'>
            {subscriptionCms?.description}
          </Typography>
          {/* <Box className='toggleBlk'>
            <BillingToggle />
          </Box> */}
        </Box>

        <Grid2 container spacing={4} className='subCards' justifyContent='center'>
          {updatedSubscriptions?.map((data, index) => (
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <SubscriptionCard {...data} />
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </SubscriptionUIWrap>
  );
}

export default SubscriptionUI;
