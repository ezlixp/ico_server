import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { GenericResult } from '../core/result';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getByUuid(uuid: string): Promise<GenericResult<User>> {
    const request = await this.userModel.findOne({ uuid });
    return GenericResult.from(request);
  }
}
