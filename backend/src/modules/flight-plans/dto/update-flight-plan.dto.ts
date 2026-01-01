import { PartialType } from '@nestjs/swagger';
import { CreateFlightPlanDto } from './create-flight-plan.dto';

export class UpdateFlightPlanDto extends PartialType(CreateFlightPlanDto) {}
