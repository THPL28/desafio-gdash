import { Controller, Get, Post, Body, UseGuards, Delete, Param, Put, Request, Patch, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { Roles, RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(['admin'])
    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async me(@Request() req: any) {
        // O AuthGuard popula req.user com o payload do JWT
        const userId = req.user?.userId;
        if (!userId) return {};
        return this.usersService.findById(userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(['admin'])
    @Post()
    async create(@Body() body: CreateUserDto) {
        return this.usersService.create(body.email, body.password, body.role);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    async updateMe(@Request() req: any, @Body() body: UpdateMeDto) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new UnauthorizedException('User ID not found in token');
        }

        // Se está tentando mudar senha, valida a senha atual
        if (body.newPassword) {
            if (!body.currentPassword) {
                throw new UnauthorizedException('Current password is required to change password');
            }
            return this.usersService.updateMeWithPasswordValidation(userId, body.currentPassword, body.newPassword);
        }

        return this.usersService.findById(userId);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(['admin'])
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(id, body);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(['admin'])
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
