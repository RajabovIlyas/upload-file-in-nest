import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Token } from '../token/token.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  password: string;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
}
