import assest from '@/json/assest';
import { BestPackageBox } from '@/styles/StyledComponents/HomeStyled';
import { Box, Container, Grid2 } from '@mui/material';
import Image from 'next/image';
import PageHeading from '../PageHeading/PageHeading';
import PricingCard, { IPricingCard } from './PricingCard';

export default function BestPackage() {
  const plans: IPricingCard[] = [
    {
      planName: 'Plan Name',
      aboutPlan: 'Ornare dolor ut tempus at molestie laoreet commodo vel. Ligula erat',
      price: 30,
      billingCycle: 'Week',
      features: [
        'Lobortis mauris tempus',
        'Urna posuere cras enim enim',
        'Dis a gravida ultrices',
        'Interdum lobortis semper.',
        'Malesuada a dui orci mauris.',
        'Ultrices duis habitant quis.',
      ],
    },
    {
      planName: 'Plan Name',
      aboutPlan: 'Ornare dolor ut tempus at molestie laoreet commodo vel. Ligula erat',
      price: 100,
      billingCycle: 'Month',
      features: [
        'Lobortis mauris tempus',
        'Urna posuere cras enim enim',
        'Dis a gravida ultrices',
        'Interdum lobortis semper.',
        'Malesuada a dui orci mauris.',
        'Ultrices duis habitant quis.',
      ],
    },
    {
      planName: 'Plan Name',
      aboutPlan: 'Ornare dolor ut tempus at molestie laoreet commodo vel. Ligula erat',
      price: 455,
      billingCycle: 'Year',
      features: [
        'Lobortis mauris tempus',
        'Urna posuere cras enim enim',
        'Dis a gravida ultrices',
        'Interdum lobortis semper.',
        'Malesuada a dui orci mauris.',
        'Ultrices duis habitant quis.',
      ],
    },
  ];

  return (
    <BestPackageBox className='cmn-gap'>
      <Image src={assest.shape01} width={170} height={392} alt='shape01' className='float-shape' />
      <Container fixed sx={{ position: 'relative', zIndex: '1' }}>
        <PageHeading
          title='Best Packages For You'
          suTitle='Interdum est pellentesque ut et nec libero vitae eget. Tempus nisl commodo.'
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
