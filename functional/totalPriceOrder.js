export const totalPriceCards = (cardsArray) => {
  let totalTotalPrice = 0;
  for (let i = 0; i < cardsArray.length; i++) {
    for (let j = 0; j < cardsArray[i].cards.length; j++) {
      totalTotalPrice += cardsArray[i].cards[j].totalPrice;
    }
  }
  return totalTotalPrice;
};
