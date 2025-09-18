import Link from 'next/link';
import { ReactNode } from 'react';

type SocialLinkProps = {
  url?: string | null;
  icon: ReactNode;
};

export default function SocialLink({ url, icon }: SocialLinkProps) {
  if (!url) return null;

  return (
    <Link href={url} target='_blank' rel='noopener noreferrer'>
      {icon}
    </Link>
  );
}
