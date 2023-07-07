import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Avatar } from './schemas/avatar.schema';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schemas';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Avatar') private readonly avatarModel: Model<Avatar>,
  ) {}

  async getAvatar(userId: string): Promise<{ avatar: string } | null> {
    const user = await this.userModel.findById(userId).exec();

    if (!user || !user.avatar) {
      return null;
    }

    const avatarData = fs.readFileSync(user.avatar, { encoding: 'base64' });

    return { avatar: avatarData };
  }

  async saveAvatar(
    data: string,
    hash: string,
    userId: string,
  ): Promise<{ path: string; encodedFile: string }> {
    const avatar = new this.avatarModel({ userId, hash, data });
    await avatar.save();

    const directory = './src/images';

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    const decodedData = Buffer.from(data, 'base64');
    const filePath = `${directory}/${hash}.png`;

    fs.writeFileSync(filePath, decodedData);

    const encodedFile = fs.readFileSync(filePath, { encoding: 'base64' });

    return { path: filePath, encodedFile };
  }
}
