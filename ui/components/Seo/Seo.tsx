import { NextSeo, NextSeoProps } from 'next-seo';

interface SeoProps extends NextSeoProps {
  title: string;
  canonical: string;
  description: string;
  url: string;
  siteName?: string;
  noindex?: boolean;
  image: string;
}

const Seo = ({
  title,
  canonical,
  description,
  url,
  siteName,
  noindex = true,
  image,
  ...rest
}: SeoProps) => {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={canonical}
      noindex={noindex}
      openGraph={{
        url,
        title,
        description,
        images: [{ url: image }],
        siteName,
      }}
      {...rest}
    />
  );
};

export default Seo;
