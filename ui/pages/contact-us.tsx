import { fetchContactUsPageInfo, submitContactForm } from '@/api/functions/contactUs.cms';
import InnerBanner from '@/components/InnerBanner/InnerBanner';
import PageHeading from '@/components/PageHeading/PageHeading';
import assest from '@/json/assest';
import Wrapper from '@/layout/wrapper/Wrapper';
import { contactUsValidationSchema, TContactUsForm } from '@/schema/contactUs.yup';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Container, Grid2, Paper, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const getServerSideProps = async () => {
  try {
    const homePageRes = await fetchContactUsPageInfo();

    if (!homePageRes) {
      return { notFound: true };
    }
    return {
      props: { ...homePageRes },
    };
  } catch (err) {
    console.error('Error fetching homepage data:', err);
    return { notFound: true };
  }
};

export default function ConatctUs(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { contactUsInfo } = props;

  console.log(contactUsInfo, 'contact us==>');
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

  const latitude = contactUsInfo?.latitude;
  const longitude = contactUsInfo?.longitude;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TContactUsForm>({
    resolver: yupResolver(contactUsValidationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const { mutateAsync: contactSubmit } = useMutation({
    mutationKey: ['submitForm'],
    mutationFn: submitContactForm,
    onSuccess: () => {
      toast.success("Your message has been sent successfully! We'll get back to you soon.");
      reset();
    },
  });

  const onSubmit = async (data: TContactUsForm) => {
    try {
      const formData = new FormData();
      formData.append('full_name', data?.fullName);
      formData.append('email', data?.email);
      formData.append('subject', data?.subject);
      formData.append('message', data?.message);
      contactSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <Wrapper>
      <ContactUsInner>
        <InnerBanner
          heading={contactUsInfo?.section_header}
          subTitle={contactUsInfo?.section_description}
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
                    title={contactUsInfo?.section_header}
                    suTitle={[contactUsInfo?.section_description]}
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
                        <Typography variant='body2'>{contactUsInfo?.call_center_number}</Typography>
                      </Box>
                    </Grid2>
                    <Grid2 size={{ md: 6, xs: 6 }}>
                      <Box className='getin-box'>
                        <Typography variant='h6'>Our Location</Typography>
                        <Typography variant='body2'>{contactUsInfo?.location}</Typography>
                      </Box>
                    </Grid2>
                    <Grid2 size={{ md: 6, xs: 6 }}>
                      <Box className='getin-box'>
                        <Typography variant='h6'>Email</Typography>
                        <Link href='mailto:example@gmail.com'>{contactUsInfo?.email}</Link>
                      </Box>
                    </Grid2>
                    <Grid2 size={{ md: 6, xs: 6 }}>
                      <Box className='getin-box social-media-links'>
                        <Typography variant='h6'>Social Network</Typography>
                        <Stack direction={'row'} spacing={1.5} className='logo-container'>
                          <Link href={contactUsInfo?.social_links?.facebook_url || '/'}>
                            <SocialFacebookIcon />
                          </Link>
                          <Link href={contactUsInfo?.social_links?.x_url || '/'}>
                            <SocialXhandleIcon />
                          </Link>
                          <Link href={contactUsInfo?.social_links?.linkedin_url || '/'}>
                            <SocialLinkdinIcon />
                          </Link>
                          <Link href={contactUsInfo?.social_links?.youtube_url || '/'}>
                            <SocialYoutubeIcon />
                          </Link>
                        </Stack>
                      </Box>
                    </Grid2>
                  </Grid2>
                </Grid2>
                <Grid2 size={{ lg: 5, md: 6, xs: 12 }}>
                  <Paper elevation={0} className='form-container'>
                    <Typography variant='h6'>{contactUsInfo?.get_in_touch_title}</Typography>
                    <Typography variant='body2' sx={{ margin: '20px 0px 30px 0px' }}>
                      {contactUsInfo?.get_in_touch_description}
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Grid2 container spacing={1.25}>
                        <Grid2 size={{ xs: 12 }}>
                          <InputFieldCommon
                            placeholder='Full Name'
                            endAdornment={<UserIcon />}
                            {...register('fullName')}
                            error={!!errors.fullName}
                            helperText={errors.fullName?.message}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <InputFieldCommon
                            placeholder='Email'
                            endAdornment={<MailIcon />}
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <InputFieldCommon
                            placeholder='Subject'
                            endAdornment={<NoteIcon />}
                            {...register('subject')}
                            error={!!errors.subject}
                            helperText={errors.subject?.message}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <InputFieldCommon
                            placeholder='Your Message'
                            multiline
                            rows={6}
                            {...register('message')}
                            error={!!errors.message}
                            helperText={errors.message?.message}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <CustomButtonPrimary
                            sx={{ marginTop: '10px' }}
                            variant='contained'
                            className='send-Btn'
                            color='primary'
                            type='submit'
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
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
              {/* <Box className='map-section' sx={{ borderRadius: '10px', overflow: 'hidden' }}>
                <LocationMap
                  apiKey={googleMapsApiKey}
                  latitude={Number(latitude)}
                  longitude={Number(longitude)}
                  locationName={contactUsInfo?.location}
                  zoom={16}
                />
              </Box> */}
              <Box
                className='map-section'
                sx={{ borderRadius: '10px', overflow: 'hidden' }}
                dangerouslySetInnerHTML={{ __html: contactUsInfo?.map_url || '' }}
              />
            </Container>
          </Box>
        </ContactUsDeatailsWrap>
      </ContactUsInner>
    </Wrapper>
  );
}
