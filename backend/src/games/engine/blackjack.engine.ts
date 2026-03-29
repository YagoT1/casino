const draw = () => Math.floor(Math.random() * 10) + 1;

const handValue = (cards: number[]) => cards.reduce((acc, card) => acc + card, 0);

export function runBlackjack(strategy: 'hit' | 'stand') {
  const player = [draw(), draw()];
  const dealer = [draw(), draw()];

  if (strategy === 'hit') player.push(draw());

  while (handValue(dealer) < 17) dealer.push(draw());

  const playerScore = handValue(player);
  const dealerScore = handValue(dealer);

  let multiplier = 0;
  if (playerScore > 21) multiplier = 0;
  else if (dealerScore > 21 || playerScore > dealerScore) multiplier = 2;
  else if (playerScore === dealerScore) multiplier = 1;

  return { player, dealer, playerScore, dealerScore, multiplier };
}
