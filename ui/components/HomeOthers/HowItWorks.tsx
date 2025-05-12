import assest from '@/json/assest';
import { HowItWorksWrapper } from '@/styles/StyledComponents/HowItWorksWrapper';
import { IHomeModel } from '@/typescript/interface/home.interface';
import { Box, Container, Grid2 } from '@mui/material';
import Image from 'next/image';
import PageHeading from '../PageHeading/PageHeading';
import { WorkCard } from './WorkCard';

export const HowItWorks = ({
  howItWorksInfo,
}: {
  howItWorksInfo: IHomeModel['HowItWorksSection'];
}) => {
  const workCardDetails = howItWorksInfo?.steps?.map(item => ({
    icon: <img src={item.icon} alt={item.title} />,
    cardTitle: item?.title,
    cardDes: item?.description,
  }));

  return (
    <HowItWorksWrapper className='cmn-gap' id='howItWorks'>
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
                src={howItWorksInfo?.image || assest.howItWorksiPhone}
                alt='howItWorksiPhone'
                width={578}
                height={665}
              />
            </figure>
          </Grid2>
          <Grid2 size={{ md: 6, xs: 12 }}>
            <Box className='rgt-part'>
              <Box className='pageHeading'>
                <PageHeading title={howItWorksInfo?.header} suTitle={howItWorksInfo?.description} />
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
