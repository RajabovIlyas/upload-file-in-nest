import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  findOne(token: Partial<Token>) {
    return this.tokenRepository.findOne({ where: token });
  }

  create(token: Omit<Token, 'id'>) {
    return this.tokenRepository.save(token);
  }

  update(id: number, token: Partial<Token>) {
    return this.tokenRepository.update(id, token);
  }

  delete(token: Partial<Token>) {
    return this.tokenRepository.delete(token);
  }
}
