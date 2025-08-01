import assest from '@/json/assest';
import { KnowMoreAboutWrap } from '@/styles/StyledComponents/AboutusStyled';
import { Box, Container, Grid2 } from '@mui/material';
import Image from 'next/image';
import PageHeading from '../PageHeading/PageHeading';

export default function KnowMoreAbout() {
  return (
    <KnowMoreAboutWrap>
      <Container fixed>
        <Grid2 container spacing={1} alignItems='center'>
          <Grid2 size={{ lg: 5.2, md: 6, xs: 12 }}>
            <PageHeading
              title='Know More About Us'
              suTitle={[
                'Lorem ipsum dolor sit amet consectetur. Non nibh sapien sed nulla ultricies. Tincidunt leo malesuada libero odio lacinia non metus quam blandit. Sed nisi turpis tellus ut blandit quis amet urna. Dignissim nisl iaculis aliquam sodales. Bibendum enim ac fermentum nullam sit.',
                'Sed enim nunc sit id netus vitae in tincidunt. Fermentum euismod a sapien eu ullamcorper dis. Urna bibendum at pellentesque ac. Pellentesque hendrerit vestibulum consequat tellus consectetur. Urna accumsan consectetur nulla tellus turpis et. Vel elit tincidunt parturient lacus duis vitae volutpat. ',
                'Lorem ipsum dolor sit amet consectetur. Non nibh sapien sed nulla ultricies. Tincidunt leo malesuada libero odio lacinia non metus quam blandit. Sed nisi turpis tellus ut blandit quis amet urna. Dignissim nisl iaculis aliquam sodales. Bibendum enim ac fermentum nullam sit.',
              ]}
              alignItem='left'
              className='sec-heading'
            />
          </Grid2>
          <Grid2 size={{ lg: 6.8, md: 6, xs: 12 }}>
            <Box className='know-right' sx={{ position: 'relative' }}>
              <figure className='lg-mask'>
                <Image
                  src={assest.largeAboutMask}
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
                    src={assest.smallAboutMask}
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
