import InnerBanner from '@/components/InnerBanner/InnerBanner';
import PageHeading from '@/components/PageHeading/PageHeading';
import assest from '@/json/assest';
import Wrapper from '@/layout/wrapper/Wrapper';
import { ContactUsDeatailsWrap, ContactUsInner } from '@/styles/StyledComponents/ContactusStyled';
import InputFieldCommon from '@/ui/CommonInput/CommonInput';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import { MailIcon } from '@/ui/Icon/Maillcon';
import { NoteIcon } from '@/ui/Icon/NoteIcon';
import SocialFacebookIcon from '@/ui/Icon/SocialFacebookIcon';
import SocialLinkdinIcon from '@/ui/Icon/SocialLinkdinIcon';
import SocialXhandleIcon from '@/ui/Icon/SocialXhandleIcon';
import SocialYoutubeIcon from '@/ui/Icon/SocialYoutubeIcon';
import UserIcon from '@/ui/Icon/UserIcon';
import { Box, Container, Grid2, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function ConatctUs() {
  return (
    <Wrapper>
      <ContactUsInner>
        <InnerBanner
          heading='Contact Us'
          subTitle='Nulla non enim tortor est euismod tempus maecenas vel adipiscing. Eget accumsan urna gravida placerat egestas dolor. Sed molestie.'
        />
        <ContactUsDeatailsWrap>
          <Box className='contact-top-sec'>
            <Image
              src={assest.starBlur}
              width={56}
              height={255}
              alt='starbg'
              className='float-right-bg'
            />
            <Container fixed>
              <Grid2 container spacing={{ md: 1, xs: 3 }} alignItems='center'>
                <Grid2 size={{ lg: 7, md: 6, xs: 12 }}>
                  <PageHeading
                    title='Feel free to contact with us for more details'
                    suTitle={[
                      'Lorem ipsum dolor sit amet consectetur. Nullam dui nisl venenatis massa nulla sem. Nam vel lectus etiam eu ut pulvinar.',
                    ]}
                    alignItem='left'
                    className='sec-heading'
                  />
                  <Grid2
                    container
                    columnSpacing={{ sm: 3, xs: 1 }}
                    rowSpacing={{ sm: 4.5, xs: 2.5 }}
                  >
                    <Grid2 size={{ md: 6, xs: 6 }}>
                      <Box className='getin-box'>
                        <Typography variant='h6'>Call Center</Typography>
                        <Typography variant='body2'>800 230458936</Typography>
                        <Link href='tel:+(123) 234 - 5676 - 1800'>+(123) 234 - 5676 - 1800</Link>
                      </Box>
                    </Grid2>
                    <Grid2 size={{ md: 6, xs: 6 }}>
                      <Box className='getin-box'>
                        <Typography variant='h6'>Our Location</Typography>
                        <Typography variant='body2'>
                          USA, New York - 1060 <br />
                          St. First Avenue 1
                        </Typography>
                      </Box>
                    </Grid2>
                    <Grid2 size={{ md: 6, xs: 6 }}>
                      <Box className='getin-box'>
                        <Typography variant='h6'>Email</Typography>
                        <Link href='mailto:example@gmail.com'>example@gmail.com</Link>
                      </Box>
                    </Grid2>
                    <Grid2 size={{ md: 6, xs: 6 }}>
                      <Box className='getin-box social-media-links'>
                        <Typography variant='h6'>Social Network</Typography>
                        <Stack direction={'row'} spacing={1.5} className='logo-container'>
                          <Link href='/'>
                            <SocialFacebookIcon />
                          </Link>
                          <Link href='/'>
                            <SocialXhandleIcon />
                          </Link>
                          <Link href='/'>
                            <SocialLinkdinIcon />
                          </Link>
                          <Link href='/'>
                            <SocialYoutubeIcon />
                          </Link>
                        </Stack>
                      </Box>
                    </Grid2>
                  </Grid2>
                </Grid2>
                <Grid2 size={{ lg: 5, md: 6, xs: 12 }}>
                  <Paper elevation={0} className='form-container'>
                    <Typography variant='h6'>Get In Touch</Typography>
                    <Typography variant='body2' sx={{ margin: '20px 0px 30px 0px' }}>
                      Lorem ipsum dolor sit amet consectetur. Lacus ornare neque sem sollicitudin
                      sit.
                    </Typography>
                    <form>
                      <Grid2 container spacing={1.25}>
                        <Grid2 size={{ xs: 12 }}>
                          <InputFieldCommon placeholder='Full Name' endAdornment={<UserIcon />} />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <InputFieldCommon placeholder='Email' endAdornment={<MailIcon />} />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <InputFieldCommon placeholder='Subject' endAdornment={<NoteIcon />} />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <InputFieldCommon placeholder='Your Message' multiline rows={6} />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <CustomButtonPrimary
                            sx={{ marginTop: '10px' }}
                            variant='contained'
                            className='send-Btn'
                            color='primary'
                          >
                            Send Message
                          </CustomButtonPrimary>
                        </Grid2>
                      </Grid2>
                    </form>
                  </Paper>
                </Grid2>
              </Grid2>
            </Container>
          </Box>
          <Box className='map-area cmn-gap'>
            <Image
              src={assest.leftStarBlur}
              width={97}
              height={232}
              alt='starbg'
              className='float-left-bg'
            />
            <Image
              src={assest.lineGraphImage}
              width={422}
              height={253}
              alt='lines'
              className='float-right-bg-map'
            />
            <Container fixed>
              <Box className='map-section' sx={{ borderRadius: '10px', overflow: 'hidden' }}>
                <Image src={assest.mapImage} alt='map' width={1140} height={442} />
              </Box>
            </Container>
          </Box>
        </ContactUsDeatailsWrap>
      </ContactUsInner>
    </Wrapper>
  );
}
