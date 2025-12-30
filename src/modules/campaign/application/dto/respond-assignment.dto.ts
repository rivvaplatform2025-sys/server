import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AssignmentStatus } from '../../domain/enums/assignment-status.enum';

export class RespondAssignmentDto {
  @ApiProperty({ enum: [AssignmentStatus.ACCEPTED, AssignmentStatus.REJECTED] })
  @IsEnum([AssignmentStatus.ACCEPTED, AssignmentStatus.REJECTED])
  status: AssignmentStatus.ACCEPTED | AssignmentStatus.REJECTED;
}
