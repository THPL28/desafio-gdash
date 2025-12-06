import { SocialService } from './social.service';
export declare class SocialController {
    private readonly socialService;
    constructor(socialService: SocialService);
    createReport(body: any): Promise<import("./social.schema").SocialReport>;
    getReports(city?: string): Promise<import("./social.schema").SocialReport[]>;
    likeReport(id: string): Promise<import("./social.schema").SocialReport>;
}
