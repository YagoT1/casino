import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Game } from './game.entity';

@Entity('bets')
export class Bet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bets)
  user: User;

  @ManyToOne(() => Game)
  game: Game;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: '0.00' })
  payout: string;

  @Column({ type: 'jsonb' })
  result: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}
