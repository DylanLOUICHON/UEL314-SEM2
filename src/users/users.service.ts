import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private UsersRepository: typeof User
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userValues = {
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
    };
    return this.UsersRepository.create(userValues);
  }

  async findAll(): Promise<User[]> {
    return this.UsersRepository.findAll<User>();
  }

  async findOne(id: number): Promise<User> {
    return this.UsersRepository.findByPk<User>(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<[number, User[]]> {
    return this.UsersRepository.update(updateUserDto, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: number): Promise<number> {
    return this.UsersRepository.destroy({ where: { id } });
  }
}
