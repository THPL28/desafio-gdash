import { Model } from 'mongoose';
import { SocialReport, SocialReportDocument } from './social.schema';
export declare class SocialService {
    private socialModel;
    constructor(socialModel: Model<SocialReportDocument>);
    createReport(data: Partial<SocialReport>): Promise<SocialReport>;
    getReports(city?: string): Promise<SocialReport[]>;
    likeReport(id: string): Promise<SocialReport>;
}
