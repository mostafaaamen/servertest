export const totalPriceSubscribe = (subscribeArray) => {
  let totalPrice = 0;
  for (let i = 0; i < subscribeArray.length; i++) {
    totalPrice += subscribeArray[i].subscribe.price;
  }
  return totalPrice;
};