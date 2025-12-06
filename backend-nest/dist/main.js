"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users/users.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    await app.listen(3001);
    console.log('NestJS backend listening on 3001');
    try {
        const usersService = app.get(users_service_1.UsersService);
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
        const adminPass = process.env.DEFAULT_ADMIN_PASS || 'admin123456';
        const existingAdmin = await usersService.findOne(adminEmail);
        if (!existingAdmin) {
            console.log('Creating default admin user...');
            await usersService.create(adminEmail, adminPass, 'admin');
            console.log(`✓ Admin user created: ${adminEmail}`);
        }
        else {
            console.log(`✓ Admin user already exists: ${adminEmail}`);
        }
    }
    catch (error) {
        console.error('Error creating admin user:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map