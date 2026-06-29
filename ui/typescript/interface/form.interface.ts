import { InputHTMLAttributes, ReactNode } from 'react';
import { Control, FieldErrors, FieldPath, FieldValues } from 'react-hook-form';

export interface FormTextFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  labelName?: string;
  type?: string;
  placeHolder?: string;
  isPassword?: boolean;
  control: Control<T>;
  errors: FieldErrors<T>;
  multiline?: boolean;
  rows?: number;
  isDisable?: boolean;
  endAdornment?: ReactNode;
  inputattributes?: InputHTMLAttributes<HTMLInputElement>;
}
