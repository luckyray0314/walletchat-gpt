const runChat = async (message: string,) => {
    try {
      const response = await fetch(`/api/openai`, {
        method: "POST",
        body: JSON.stringify({
          message
        })
      });
      const news = await response.text();
      if(news){
        return news;
      }
    } catch (e: any) {
      console.log(e.message);
    }
};

export default runChat;