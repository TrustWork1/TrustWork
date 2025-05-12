import assest from '@/json/assest';
import { BestPackageBox } from '@/styles/StyledComponents/HomeStyled';
import { IHomeModel } from '@/typescript/interface/home.interface';
import { Box, Container, Grid2 } from '@mui/material';
import Image from 'next/image';
import PageHeading from '../PageHeading/PageHeading';
import PricingCard from './PricingCard';

export default function BestPackage({
  packageInfo,
}: {
  packageInfo: IHomeModel['PricingPlanSection'];
}) {
  const plans = packageInfo?.pricing_plans?.map(item => ({
    planName: item?.plan_name,
    aboutPlan: item?.description,
    price: Number(item?.price),
    billingCycle: item?.billing_cycle,
    features: item?.features?.map(f => f.features) || [],
  }));

  return (
    <BestPackageBox className='cmn-gap'>
      <Image src={assest.shape01} width={170} height={392} alt='shape01' className='float-shape' />
      <Container fixed sx={{ position: 'relative', zIndex: '1' }}>
        <PageHeading
          title={packageInfo?.header}
          suTitle={packageInfo?.description}
          alignItem='center'
        />
        <Box className='pricing-list'>
          <Grid2 container spacing={3} justifyContent='center'>
            {plans.map((plan, index) => (
              <Grid2 size={{ lg: 4, md: 6, xs: 12 }} key={index}>
                <PricingCard {...plan} />
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Container>
    </BestPackageBox>
  );
}
