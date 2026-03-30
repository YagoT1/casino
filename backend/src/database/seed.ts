import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Game } from 'src/games/entities/game.entity';

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Game],
  synchronize: true,
});

async function seed() {
  await ds.initialize();

  const userRepo = ds.getRepository(User);
  const gameRepo = ds.getRepository(Game);

  const adminEmail = 'admin@casino.dev';
  const playerEmail = 'player@casino.dev';

  if (!(await userRepo.findOneBy({ email: adminEmail }))) {
    await userRepo.save(
      userRepo.create({
        email: adminEmail,
        passwordHash: await bcrypt.hash('Admin1234!', 12),
        fullName: 'Casino Admin',
        birthDate: '1990-01-01',
        role: 'admin',
      }),
    );
  }

  if (!(await userRepo.findOneBy({ email: playerEmail }))) {
    await userRepo.save(
      userRepo.create({
        email: playerEmail,
        passwordHash: await bcrypt.hash('Player1234!', 12),
        fullName: 'Demo Player',
        birthDate: '1995-06-15',
        role: 'player',
      }),
    );
  }

  const games = [
    { slug: 'slot-machine', name: 'Neon Slots' },
    { slug: 'blackjack', name: 'Blackjack Pro' },
  ];

  for (const game of games) {
    if (!(await gameRepo.findOneBy({ slug: game.slug }))) {
      await gameRepo.save(gameRepo.create(game));
    }
  }

  await ds.destroy();
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
