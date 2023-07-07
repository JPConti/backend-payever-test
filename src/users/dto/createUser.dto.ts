export class CreateUserDto {
  user: {
    name: string;
    email: string;
  };
  avatar: {
    data: string;
  };
}
