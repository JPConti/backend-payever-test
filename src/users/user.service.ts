import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { AvatarService } from 'src/avatar/avatar.service';
import { MailerService } from '@nestjs-modules/mailer';
import { MessageService } from 'src/message/message.service';
import { User } from './schemas/user.schemas';
import { listAvatar, listUsers } from 'src/reqres/listUser';

import * as fs from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly avatarService: AvatarService,
    private readonly mailerService: MailerService,
    private readonly rabbitService: MessageService,
  ) {}

  async createUser(
    user: { name: string; email: string },
    avatar: { data: string },
  ): Promise<any> {
    const createdUser = new this.userModel(user);
    const timestamp = Date.now();
    console.log(createdUser);
    const randomValue = Math.random().toString().substring(2);
    const hash = `${createdUser._id}-${timestamp}-${randomValue}`;
    const { path, encodedFile } = await this.saveUserAvatar(
      createdUser._id,
      hash,
      avatar.data,
    );
    createdUser.avatar = path;
    await this.sendEmail(createdUser);
    await this.rabbitService.sendEvent(
      'user_created',
      JSON.stringify(createdUser),
    );
    await createdUser.save();
    return { createdUser, encodedUserAvatar: encodedFile };
  }

  private async sendEmail(user: User): Promise<void> {
    const username = user.name;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to our platform!',
      template: 'user-created',
      context: {
        username,
      },
    });
  }

  async getUserById(user: string): Promise<any | null> {
    return await listUsers(user);
  }

  async saveUserAvatar(
    data: string,
    hash: string,
    userId: string,
  ): Promise<{ path: string; encodedFile: string }> {
    const { path, encodedFile } = await this.avatarService.saveAvatar(
      userId,
      hash,
      data,
    );
    return { path, encodedFile };
  }

  async getUserAvatar(user: string): Promise<{ avatar: string }> {
    return await listAvatar(user);
  }

  async deleteUserAvatarFile(path: string): Promise<void> {
    try {
      fs.unlinkSync(path);
    } catch (error) {
      console.error('Error deleting avatar file:', error);
      throw new Error('Was not possible to delete avatar file');
    }
  }

  async deleteUserAvatar(userId: string): Promise<void> {
    await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        { $unset: { avatar: 1 } },
        { new: true },
      )
      .exec();
  }
}
