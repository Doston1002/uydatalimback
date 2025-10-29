import { IsOptional, IsBoolean, IsIn } from 'class-validator';

export class UpdateContactDto {
  isRead?: boolean;
  status?: 'pending' | 'replied' | 'closed';
}
