import { fetchSubscriptionCmsData, fetchSubscriptionPageData } from '@/api/functions/subscription';
import InnerBanner from '@/components/InnerBanner/InnerBanner';
import SubscriptionUI from '@/components/SubscriptionComponents/SubscriptionUI';
import Wrapper from '@/layout/wrapper/Wrapper';
import { InferGetServerSidePropsType } from 'next';

export const getServerSideProps = async () => {
  try {
    const subscriptionPageRes = await fetchSubscriptionPageData();
    const subscriptionCmsRes = await fetchSubscriptionCmsData();

    if (!subscriptionPageRes || !subscriptionCmsRes) {
      return { notFound: true };
    }
    return {
      props: { ...subscriptionPageRes, ...subscriptionCmsRes },
    };
  } catch {
    return { notFound: true };
  }
};
export default function Subscription(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { subscriptionPackageList, downloadUrls, subscriptionCms } = props;

  return (
    <Wrapper
      downloadUrls={{
        appStore: downloadUrls?.appstore_link,
        playStore: downloadUrls?.playstore_link,
      }}
    >
      <InnerBanner
        heading={'Subscription Plan'}
        subTitle={
          'Pick a plan that grows with your goals. Our subscription options are flexible, transparent, and built to meet the needs of individuals and businesses alike.'
        }
      />
      <SubscriptionUI
        subscriptionPackageList={subscriptionPackageList}
        subscriptionCms={subscriptionCms}
      />
    </Wrapper>
  );
}
