import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('bonuses')
export class Bonus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bonuses)
  user: User;

  @Column()
  name: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'int' })
  rolloverMultiplier: number;

  @Column({ default: false })
  consumed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
