import { Module } from '@nestjs/common';
import { DisastersService } from './disasters.service';
import { DisastersController } from './disasters.controller';

@Module({
  controllers: [DisastersController],
  providers: [DisastersService],
})
export class DisastersModule {}
