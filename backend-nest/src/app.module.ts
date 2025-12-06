import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherModule } from './weather/weather.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PokeApiModule } from './pokeapi/pokeapi.module';
import { SocialModule } from './social/social.module';
import { DisastersModule } from './disasters/disasters.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://mongo:27017/gdash'),
    WeatherModule,
    AuthModule,
    UsersModule,
    PokeApiModule,
    SocialModule,
    DisastersModule,
  ],
})
export class AppModule { }

