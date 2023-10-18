import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createOne(email: string, hash: string) {
    return await this.userModel.create({
      email,
      password: hash,
    });
  }

  async findOne(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  public async attachWalletAddress(email: string, wallet: string) {
    return await this.userModel
      .findOneAndUpdate(
        { email },
        { wallet },
        {
          new: true,
          returnDocument: 'after',
        },
      )
      .exec();
  }
}
