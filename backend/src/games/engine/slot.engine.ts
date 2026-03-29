const symbols = ['🍒', '🔔', '🍋', '⭐', '7️⃣'];

export function spinSlot() {
  const reel = Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);

  let multiplier = 0;
  if (reel[0] === reel[1] && reel[1] === reel[2]) multiplier = 5;
  else if (new Set(reel).size === 2) multiplier = 2;

  return { reel, multiplier };
}
