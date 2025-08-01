import assest from '@/json/assest';
import { HowItWorksWrapper } from '@/styles/StyledComponents/HowItWorksWrapper';
import { DownloadIcon } from '@/ui/Icon/DownloadIcon';
import { PaymentIcon } from '@/ui/Icon/PaymentIcon';
import { RocketIcon } from '@/ui/Icon/RocketIcon';
import { Box, Container, Grid2 } from '@mui/material';
import Image from 'next/image';
import PageHeading from '../PageHeading/PageHeading';
import { WorkCard } from './WorkCard';

export const HowItWorks = () => {
  const workCardDetails = [
    {
      icon: <DownloadIcon />,
      cardTitle: 'Download App',
      cardDes: 'Ornare dolor ut tempus at molestie laoreet commodo vel. Ligula erat',
    },
    {
      icon: <RocketIcon />,
      cardTitle: 'Start Project ',
      cardDes: 'Ornare dolor ut tempus at molestie laoreet commodo vel. Ligula erat',
    },
    {
      icon: <PaymentIcon />,
      cardTitle: 'Get Payment',
      cardDes: 'Ornare dolor ut tempus at molestie laoreet commodo vel. Ligula erat',
    },
  ];

  return (
    <HowItWorksWrapper className='cmn-gap'>
      <Image
        src={assest.howItWorks_FloatShape}
        alt='howItWorks_TopRightShape'
        width={159}
        height={392}
        className='howItWorks_FloatShape'
      />
      <Container fixed sx={{ position: 'relative', zIndex: 1 }}>
        <Grid2 container spacing={{ md: 2.62, xs: 2 }} alignItems='center'>
          <Grid2 size={{ md: 6, xs: 12 }}>
            <figure className='how-it-fig'>
              <Image
                src={assest.howItWorksiPhone}
                alt='howItWorksiPhone'
                width={578}
                height={665}
              />
            </figure>
          </Grid2>
          <Grid2 size={{ md: 6, xs: 12 }}>
            <Box className='rgt-part'>
              <Box className='pageHeading'>
                <PageHeading
                  title='How Its Work'
                  suTitle='Interdum est pellentesque ut et nec libero vitae eget. Tempus nisl commodo proin ac nam vulputate cursus. Lectus aliquam duis cursus habitant adipiscing sollicitudin nec odio.'
                />
              </Box>
              {workCardDetails.map((item, index) => (
                <Box key={index} className='work_card_list'>
                  <WorkCard
                    icon={item.icon}
                    cardTitle={item.cardTitle}
                    cardDes={item.cardDes}
                    indexValue={index}
                  />
                </Box>
              ))}
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </HowItWorksWrapper>
  );
};
