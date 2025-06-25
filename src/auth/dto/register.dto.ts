import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: `Please provide a valid email address` })
  email: string;

  @IsNotEmpty({ message: `Name is required.` })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only letters and spaces.',
  })
  @MinLength(6, { message: 'Name must be at least 6 characters long' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  name: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long.',
  })
  @MaxLength(32, {
    message: 'Password must not exceed 32 characters.',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter.',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number.',
  })
  @Matches(/(?=.*[@$!%*?&])/, {
    message:
      'Password must contain at least one special character (@, $, !, %, *, ?, &).',
  })
  password: string;
}
