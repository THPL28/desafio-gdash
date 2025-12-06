import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async onModuleInit() {
        // Create default user if not exists
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
        const adminPass = process.env.DEFAULT_ADMIN_PASS || 'admin123456';

        const existing = await this.findOne(adminEmail);
        if (!existing) {
            await this.create(adminEmail, adminPass, 'admin');
            console.log(`Default admin created: ${adminEmail}`);
        }
    }

    async create(email: string, pass: string, role = 'user'): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(pass, salt);
        const createdUser = new this.userModel({ email, passwordHash, role });
        const saved = await createdUser.save();
        const obj = (saved as any).toObject();
        delete obj.passwordHash;
        return obj;
    }

    async findOne(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string) {
        return this.userModel.findById(id).select('-passwordHash').exec();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().select('-passwordHash').exec();
    }

    async delete(id: string) {
        return this.userModel.findByIdAndDelete(id).exec();
    }

    async update(id: string, body: { password?: string; role?: string }) {
        const update: any = {};
        if (body.password) {
            const salt = await bcrypt.genSalt(10);
            update.passwordHash = await bcrypt.hash(body.password, salt);
        }
        if (body.role) update.role = body.role;

        const updated = await this.userModel.findByIdAndUpdate(id, update, { new: true }).select('-passwordHash').exec();
        return updated;
    }

    async updateMeWithPasswordValidation(userId: string, currentPassword: string, newPassword: string) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Valida senha atual
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        // Hash nova senha e atualiza
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        const updated = await this.userModel.findByIdAndUpdate(userId, { passwordHash }, { new: true }).select('-passwordHash').exec();
        return updated;
    }
}
