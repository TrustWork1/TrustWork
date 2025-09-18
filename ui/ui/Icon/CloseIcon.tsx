import { CustomIconProps } from '@/typescript/interface/icons.interface';

function CloseIcon({ IconColor, IconHeight, IconWidth }: CustomIconProps) {
  return (
    <svg
      width={IconWidth || '34'}
      height={IconHeight || '34'}
      viewBox='0 0 34 34'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M12.0503 12.0503L21.9497 21.9498M21.9497 12.0503L12.0503 21.9498'
        stroke={IconColor || '#111610'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default CloseIcon;
