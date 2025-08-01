import { OurFeaturesWrapper } from '@/styles/StyledComponents/OurFeaturesWrapper';
import { HammerIcon } from '@/ui/Icon/HammerIcon';
import { PaperPlaneIcon } from '@/ui/Icon/PaperPlaneIcon';
import { SettingsIcon } from '@/ui/Icon/SettingsIcon';
import { TwoUserIcon } from '@/ui/Icon/TwoUserIcon';
import { Box, Container, Grid2 } from '@mui/material';
import PageHeading from '../PageHeading/PageHeading';
import { OurFeatureCard } from './FeatureCard';

export const FeatureCard = () => {
  const featureCardDetails = [
    {
      icon: <SettingsIcon />,
      title: 'Handle Project',
      des: 'Ac elit mattis massa semper. Odio et id suscipit velit. Ut ipsum turpis id quam sagittis risu',
    },
    {
      icon: <HammerIcon />,
      title: 'Handle Project',
      des: 'Ac elit mattis massa semper. Odio et id suscipit velit. Ut ipsum turpis id quam sagittis risu',
    },
    {
      icon: <PaperPlaneIcon />,
      title: 'Handle Project',
      des: 'Ac elit mattis massa semper. Odio et id suscipit velit. Ut ipsum turpis id quam sagittis risu',
    },
    {
      icon: <TwoUserIcon />,
      title: 'Handle Project',
      des: 'Ac elit mattis massa semper. Odio et id suscipit velit. Ut ipsum turpis id quam sagittis risu',
    },
  ];
  return (
    <OurFeaturesWrapper className='cmn-gap'>
      <Container fixed>
        <Box className='pageHeading'>
          <PageHeading
            title='Our Features'
            suTitle='Iaculis sed laoreet purus adipiscing. Mattis hac turpis duis id id. Iaculis felis dignissim.'
          />
        </Box>
        <Grid2 container spacing={{ lg: 3, xs: 2 }} justifyContent='center'>
          {featureCardDetails.map((item, index) => (
            <Grid2 size={{ md: 3, sm: 6, xs: 12 }} key={index}>
              <OurFeatureCard icon={item.icon} cardTitle={item.title} cardDes={item.des} />
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </OurFeaturesWrapper>
  );
};
