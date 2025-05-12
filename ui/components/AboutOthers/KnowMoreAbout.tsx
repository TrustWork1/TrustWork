import assest from '@/json/assest';
import { KnowMoreAboutWrap } from '@/styles/StyledComponents/AboutusStyled';
import { IAboutModel } from '@/typescript/interface/aboutUs.interfaces';
import { Box, Container, Grid2 } from '@mui/material';
import Image from 'next/image';
import PageHeading from '../PageHeading/PageHeading';

export default function KnowMoreAbout({ aboutUsInfo }: { aboutUsInfo: IAboutModel['AboutUs'] }) {
  return (
    <KnowMoreAboutWrap>
      <Container fixed>
        <Grid2 container spacing={1} alignItems='center'>
          <Grid2 size={{ lg: 5.2, md: 6, xs: 12 }}>
            <PageHeading
              title={aboutUsInfo?.title}
              suTitle={[aboutUsInfo?.description]}
              alignItem='left'
              className='sec-heading'
            />
          </Grid2>
          <Grid2 size={{ lg: 6.8, md: 6, xs: 12 }}>
            <Box className='know-right' sx={{ position: 'relative' }}>
              <figure className='lg-mask'>
                <Image
                  src={aboutUsInfo?.image1 || assest.largeAboutMask}
                  width={1000}
                  height={1000}
                  alt='largeAboutMask'
                />
              </figure>
              <Box className='float-box'>
                <Image
                  src={assest.hexagonShape}
                  width={243}
                  height={265}
                  alt='hexagonShape'
                  className='overlay-hexa'
                />
                <figure className='sm-mask'>
                  <Image
                    src={aboutUsInfo?.image2 || assest.smallAboutMask}
                    width={500}
                    height={500}
                    alt='smallAboutMask'
                  />
                </figure>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </KnowMoreAboutWrap>
  );
}
