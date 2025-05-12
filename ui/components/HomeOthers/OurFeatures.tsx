import { OurFeaturesWrapper } from '@/styles/StyledComponents/OurFeaturesWrapper';
import { IHomeModel } from '@/typescript/interface/home.interface';
import { Box, Container, Grid2 } from '@mui/material';
import PageHeading from '../PageHeading/PageHeading';
import { OurFeatureCard } from './FeatureCard';

export const FeatureCard = ({
  featureSectionInfo,
}: {
  featureSectionInfo: IHomeModel['FeatureSection'];
}) => {
  const featureCardDetails = featureSectionInfo?.features?.map(item => ({
    icon: <img src={item.icon} alt={item.title} />,
    title: item.title,
    des: item.description,
  }));

  return (
    <OurFeaturesWrapper className='cmn-gap' id='ourFeature'>
      <Container fixed>
        <Box className='pageHeading'>
          <PageHeading
            title={featureSectionInfo?.header}
            suTitle={featureSectionInfo?.description}
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
