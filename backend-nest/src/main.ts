import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UsersService } from './users/users.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    // Habilita validação global para DTOs
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    
    await app.listen(3001);
    console.log('NestJS backend listening on 3001');

    // Criar usuário admin padrão se não existir
    try {
        const usersService = app.get(UsersService);
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
        const adminPass = process.env.DEFAULT_ADMIN_PASS || 'admin123456';
        
        const existingAdmin = await usersService.findOne(adminEmail);
        if (!existingAdmin) {
            console.log('Creating default admin user...');
            await usersService.create(adminEmail, adminPass, 'admin');
            console.log(`✓ Admin user created: ${adminEmail}`);
        } else {
            console.log(`✓ Admin user already exists: ${adminEmail}`);
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}
bootstrap();