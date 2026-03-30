import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { LedgerTransaction } from 'src/wallet/entities/ledger-transaction.entity';
import { Bet } from 'src/games/entities/bet.entity';
import { Bonus } from 'src/bonuses/entities/bonus.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  fullName!: string;

  @Column({ type: 'date' })
  birthDate!: string;

  @Column({ default: 'player' })
  role!: 'player' | 'admin';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => LedgerTransaction, (tx) => tx.user)
  transactions!: LedgerTransaction[];

  @OneToMany(() => Bet, (bet) => bet.user)
  bets!: Bet[];

  @OneToMany(() => Bonus, (bonus) => bonus.user)
  bonuses!: Bonus[];
}
