import { fetchPrivacyPolicyfn } from '@/api/functions/privacyPolicy.cms';
import InnerBanner from '@/components/InnerBanner/InnerBanner';
import assest from '@/json/assest';
import Wrapper from '@/layout/wrapper/Wrapper';
import { TermsAndCondInner } from '@/styles/StyledComponents/TermsAndConditionsStyled';
import { PrivacyPolicyProps } from '@/typescript/types/privacyPolicy.type';
import { Container } from '@mui/material';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';

export const getServerSideProps: GetServerSideProps<PrivacyPolicyProps> = async () => {
  try {
    const { data, status } = await fetchPrivacyPolicyfn();

    if (!data) {
      return { notFound: true };
    }

    return {
      props: {
        data,
        status,
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default function PrivacyPolicy(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { data } = props;
  return (
    <Wrapper>
      <InnerBanner heading={data?.section_header} subTitle={data?.section_description} />
      <TermsAndCondInner>
        <Image
          src={assest.starImage7}
          width={65}
          height={230}
          alt='starbg'
          className='float-right-bg-one'
        />
        <Image
          src={assest.starImage4}
          width={122}
          height={232}
          alt='starbg'
          className='float-right-bg-two-privacy'
        />
        <Image
          src={assest.starImage5}
          width={136}
          height={232}
          alt='starbg'
          className='float-left-bg-privacy'
        />
        <Container fixed>
          <div dangerouslySetInnerHTML={{ __html: data?.details }} />
        </Container>
      </TermsAndCondInner>
    </Wrapper>
  );
}
