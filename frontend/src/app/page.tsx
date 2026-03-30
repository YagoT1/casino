import Link from 'next/link';

const games = [
  { slug: 'slot-machine', name: 'Neon Slots', description: '3 reels, simple paylines, high volatility.' },
  { slug: 'blackjack', name: 'Blackjack Pro', description: 'Dealer AI, hit/stand gameplay.' },
];

export default function Home() {
  return (
    <section>
      <h1 className="text-4xl font-bold">Casino iGaming MVP</h1>
      <p className="mt-2 text-gray-300">Plataforma full stack lista para monetización y escalado.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {games.map((game) => (
          <Link key={game.slug} href={`/games/${game.slug}`} className="rounded-2xl bg-casino-card p-6 shadow-lg">
            <h2 className="text-2xl font-semibold">{game.name}</h2>
            <p className="mt-2 text-gray-300">{game.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
