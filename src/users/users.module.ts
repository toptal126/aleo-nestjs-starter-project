import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      process.env.DATABASE_NAME,
    ),
  ],
})
export class UsersModule {}
