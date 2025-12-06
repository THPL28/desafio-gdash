import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { SocialReport, SocialReportSchema } from './social.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: SocialReport.name, schema: SocialReportSchema }]),
    ],
    controllers: [SocialController],
    providers: [SocialService],
})
export class SocialModule { }
