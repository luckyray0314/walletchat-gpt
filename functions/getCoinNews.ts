export const getCoinNews = async (coin: string, setError: any) => {
  try {
    const response = await fetch(`/api/news`, {
      method: "POST",
      body: JSON.stringify({
        coin: coin
      })
    });
    const news = await response.json();
    if(news){
      return news;
    }
  } catch (e: any) {
    console.log(e.message);
    if (setError) {
      setError(true);
    }
  }
};