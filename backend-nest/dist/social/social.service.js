"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const social_schema_1 = require("./social.schema");
let SocialService = class SocialService {
    constructor(socialModel) {
        this.socialModel = socialModel;
    }
    async createReport(data) {
        const report = new this.socialModel(data);
        return report.save();
    }
    async getReports(city) {
        const filter = city ? { city: { $regex: new RegExp(city, 'i') } } : {};
        return this.socialModel.find(filter).sort({ createdAt: -1 }).limit(50).exec();
    }
    async likeReport(id) {
        return this.socialModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true }).exec();
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(social_schema_1.SocialReport.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SocialService);
//# sourceMappingURL=social.service.js.map