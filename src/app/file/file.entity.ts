import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  path: string;

  @Column()
  name: string;

  @Column({ type: 'json' })
  info: {
    encoding: string;
    mimetype: string;
    size: number;
  };
}
