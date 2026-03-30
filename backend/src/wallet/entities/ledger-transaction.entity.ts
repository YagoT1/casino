import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

export type LedgerType = 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';

@Entity('ledger_transactions')
export class LedgerTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  type!: LedgerType;

  @Column({ type: 'varchar' })
  direction!: 'credit' | 'debit';

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount!: string;

  @Column({ nullable: true })
  referenceId!: string;

  @Column({ nullable: true })
  metadata!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  user!: User;
}
