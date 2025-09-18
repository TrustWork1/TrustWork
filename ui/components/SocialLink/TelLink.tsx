import Link from 'next/link';

type TelLinkProps = {
  phone?: string | null;
  className?: string;
};

function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, ''); // keep only digits and '+'
}

export default function TelLink({ phone, className }: TelLinkProps) {
  if (!phone) return null;

  const cleaned = cleanPhoneNumber(phone);

  return (
    <Link href={`tel:${cleaned}`} className={className || 'text-blue-600 hover:underline'}>
      {phone}
    </Link>
  );
}
