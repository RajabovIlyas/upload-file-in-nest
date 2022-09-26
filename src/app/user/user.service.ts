import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOne(user: Partial<User>) {
    return this.usersRepository.findOne({ where: user });
  }

  create(user: Omit<User, 'id' | 'tokens'>) {
    return this.usersRepository.save(user);
  }
}
