import { useQuery } from '@tanstack/react-query';
import { faqQuery } from '@/api/functions/cms.api';

const useFaqHooks = () => {
  const faq = useQuery({
    queryKey: ['FAQ'],
    queryFn: faqQuery,
  });

  return {
    faq,
  };
};

export default useFaqHooks;
