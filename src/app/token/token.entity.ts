import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  refreshToken: string;

  @Column({unique: true})
  key: string;

  @ManyToOne(() => User, (user) => user.tokens, {nullable: false})
  user: User;
}
