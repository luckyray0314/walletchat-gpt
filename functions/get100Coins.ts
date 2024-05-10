export const get100Coins = async () => {
  try {
    const response = await fetch(`/api/coingecko/coins`);
    const coins = await response.json();
    if(coins){
      console.log("RESPONSE>>>", response);
      return coins;
    }
  } catch (e: any) {
    console.log("ERROR>>>", e.message);
  }
};