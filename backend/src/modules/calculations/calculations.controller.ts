import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CalculationsService } from './calculations.service';

@ApiTags('calculations')
@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}
}
