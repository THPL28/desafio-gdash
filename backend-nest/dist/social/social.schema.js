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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialReportSchema = exports.SocialReport = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let SocialReport = class SocialReport {
};
exports.SocialReport = SocialReport;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SocialReport.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SocialReport.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SocialReport.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SocialReport.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SocialReport.prototype, "longitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SocialReport.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'anonymous' }),
    __metadata("design:type", String)
], SocialReport.prototype, "userId", void 0);
exports.SocialReport = SocialReport = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SocialReport);
exports.SocialReportSchema = mongoose_1.SchemaFactory.createForClass(SocialReport);
//# sourceMappingURL=social.schema.js.map