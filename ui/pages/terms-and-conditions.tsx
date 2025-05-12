import { fetchTermAndConditionfn } from '@/api/functions/termCondition.cms';
import InnerBanner from '@/components/InnerBanner/InnerBanner';
import assest from '@/json/assest';
import Wrapper from '@/layout/wrapper/Wrapper';
import { TermsAndCondInner } from '@/styles/StyledComponents/TermsAndConditionsStyled';
import { TermsAndConditionsProps } from '@/typescript/types/termCondition.type';
import { Container } from '@mui/material';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';

export const getServerSideProps: GetServerSideProps<TermsAndConditionsProps> = async () => {
  try {
    const { data, status } = await fetchTermAndConditionfn();

    if (!data) {
      return { notFound: true };
    }

    return {
      props: {
        data,
        status,
      },
    };
  } catch (err) {
    console.error('Error fetching terms and conditions:', err);
    return { notFound: true };
  }
};

export default function TermsAndConditions(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { data } = props;

  return (
    <Wrapper>
      <InnerBanner heading={data?.section_header} subTitle={data?.section_description} />
      <TermsAndCondInner>
        <Image
          src={assest.leftStarBlur}
          width={97}
          height={232}
          alt='starbg'
          className='float-left-bg'
        />
        <Image
          src={assest.starImage7}
          width={65}
          height={230}
          alt='starbg'
          className='float-right-bg-one'
        />
        <Image
          src={assest.starImage6}
          width={159}
          height={230}
          alt='starbg'
          className='float-right-bg-two'
        />
        <Container fixed>
          <div dangerouslySetInnerHTML={{ __html: data.details }} />
        </Container>
      </TermsAndCondInner>
    </Wrapper>
  );
}
