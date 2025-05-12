import assest from '@/json/assest';
import { WhyUsWrap } from '@/styles/StyledComponents/AboutusStyled';
import { IAboutModel } from '@/typescript/interface/aboutUs.interfaces';
import { Box, Container, Grid2, Typography } from '@mui/material';
import Image from 'next/image';
import PageHeading from '../PageHeading/PageHeading';
import WhyUsIconCard from './WhyUsIconCard';

export default function WhyUs({ whyUsInfo }: { whyUsInfo: IAboutModel['WhyYouTrustUs'] }) {
  const leftColumnItems = whyUsInfo?.features?.filter((_, i) => i % 2 === 0); // 0, 2
  const rightColumnItems = whyUsInfo?.features?.filter((_, i) => i % 2 !== 0); // 1, 3

  return (
    <WhyUsWrap sx={{ position: 'relative' }}>
      <Image
        src={assest.aboutFloatLeft}
        width={43}
        height={180}
        alt=''
        className='about-float-left'
      />
      <Image
        src={assest.aboutFloatRight}
        width={106}
        height={255}
        alt=''
        className='about-float-right'
      />
      <Container fixed>
        <Box className='headerSection'>
          <PageHeading
            title={whyUsInfo?.section_header}
            suTitle={[whyUsInfo?.section_description]}
            alignItem='center'
            className='sec-heading'
          />
        </Box>

        <Grid2 container alignItems='center' columnSpacing={{ md: 0, xs: 1 }}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 2.75 }}>
            <Box className='column-cont'>
              {leftColumnItems.map(item => (
                <WhyUsIconCard
                  key={item.id}
                  cardIcon={
                    <img src={item.icon} alt={item.title} style={{ width: 40, height: 40 }} />
                  }
                  cardHead={item.title}
                  cardPara={item.description}
                />
              ))}
            </Box>
          </Grid2>

          <Grid2
            size={{ xs: 12, sm: 12, md: 6, lg: 6.5 }}
            sx={{ display: { md: 'block', sm: 'none', xs: 'none' } }}
          >
            <Box className='imageArrangement'>
              <Image
                className='centerEllipse'
                src={assest.centerEllipse}
                width={644}
                height={644}
                alt='trustwork design image'
              />
              <Image
                className='outerStar'
                src={assest.outerStar}
                width={644}
                height={583}
                alt='trustwork design image'
              />
              <Typography variant='h1' className='imageText'>
                TRUST
              </Typography>
              <Typography variant='h1' className='imageText'>
                WORK
              </Typography>
              <Image
                className='innerStar'
                src={assest.innerStar}
                width={528}
                height={477}
                alt='trustwork design image'
              />
              <Image
                className='phoneHolding'
                src={whyUsInfo?.section_image || assest.phoneHolding}
                width={583}
                height={799}
                alt='trustwork design image'
              />
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 2.75 }}>
            <Box className='column-cont'>
              {rightColumnItems.map(item => (
                <WhyUsIconCard
                  key={item.id}
                  cardIcon={
                    <img src={item.icon} alt={item.title} style={{ width: 40, height: 40 }} />
                  }
                  cardHead={item.title}
                  cardPara={item.description}
                />
              ))}
            </Box>
          </Grid2>
        </Grid2>
      </Container>

      <Box className='bottom-sahpe' sx={{ position: 'relative' }}>
        <img src={assest.whyUsButtomShape} alt='buttom-shape' />
        <Typography variant='h3' className='big-text'>
          TrustWork
        </Typography>
      </Box>
    </WhyUsWrap>
  );
}
