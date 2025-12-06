import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialReport, SocialReportDocument } from './social.schema';

@Injectable()
export class SocialService {
    constructor(
        @InjectModel(SocialReport.name) private socialModel: Model<SocialReportDocument>,
    ) { }

    async createReport(data: Partial<SocialReport>): Promise<SocialReport> {
        const report = new this.socialModel(data);
        return report.save();
    }

    async getReports(city?: string): Promise<SocialReport[]> {
        const filter = city ? { city: { $regex: new RegExp(city, 'i') } } : {};
        return this.socialModel.find(filter).sort({ createdAt: -1 }).limit(50).exec();
    }

    async likeReport(id: string): Promise<SocialReport> {
        return this.socialModel.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } },
            { new: true }
        ).exec();
    }
}
