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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async onModuleInit() {
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
        const adminPass = process.env.DEFAULT_ADMIN_PASS || 'admin123456';
        const existing = await this.findOne(adminEmail);
        if (!existing) {
            await this.create(adminEmail, adminPass, 'admin');
            console.log(`Default admin created: ${adminEmail}`);
        }
    }
    async create(email, pass, role = 'user') {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(pass, salt);
        const createdUser = new this.userModel({ email, passwordHash, role });
        const saved = await createdUser.save();
        const obj = saved.toObject();
        delete obj.passwordHash;
        return obj;
    }
    async findOne(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(id) {
        return this.userModel.findById(id).select('-passwordHash').exec();
    }
    async findAll() {
        return this.userModel.find().select('-passwordHash').exec();
    }
    async delete(id) {
        return this.userModel.findByIdAndDelete(id).exec();
    }
    async update(id, body) {
        const update = {};
        if (body.password) {
            const salt = await bcrypt.genSalt(10);
            update.passwordHash = await bcrypt.hash(body.password, salt);
        }
        if (body.role)
            update.role = body.role;
        const updated = await this.userModel.findByIdAndUpdate(id, update, { new: true }).select('-passwordHash').exec();
        return updated;
    }
    async updateMeWithPasswordValidation(userId, currentPassword, newPassword) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        const updated = await this.userModel.findByIdAndUpdate(userId, { passwordHash }, { new: true }).select('-passwordHash').exec();
        return updated;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map