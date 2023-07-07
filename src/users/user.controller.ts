import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './schemas/user.schemas';
import axios from 'axios';
import { writeFile } from 'fs';
import { url } from 'inspector';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const { user, avatar } = createUserDto;
    console.log(user);
    const createdUser = await this.usersService.createUser(user, avatar);
    console.log(createdUser);
    return createdUser;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const response = await axios.get(`https://reqres.in/api/users/${id}`);
    const user = response.data.data;
    // const img = await axios.get(`https://reqres.in/api/users/${user.avatar}`);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get(':userId/avatar')
  async getUserAvatar(@Param('userId') userId: string) {
    const response = await axios.get(`https://reqres.in/api/users/${userId}`);
    const user = response.data.data;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const avatarUrl = user.avatar;

    const img = await axios
      .get(avatarUrl, {
        responseType: 'arraybuffer',
      })
      .then((response) =>
        Buffer.from(response.data, 'binary').toString('base64'),
      );

    console.log(img);

    const download = writeFile(
      `src/images/${user.id}.jpg`,
      img,
      'base64',
      (err) => {
        if (err) console.log(err);
        else {
          console.log('File written successfully\n');
          console.log('The written has the following contents:');
        }
      },
    );
    return { message: 'File written successfully' };
  }

  @Delete(':userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string) {
    const user = await this.usersService.getUserById(userId);
    console.log(user);
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }

    // await this.usersService.deleteUserAvatarFile(user.avatar);

    // await this.usersService.deleteUserAvatar(userId);

    return { message: 'Avatar was deleted' };
  }
}
