import axios from "axios";

export const POST = async (req: Request, res: Response) => {
    const { coin } = await req.json();
    const url = `https://cryptonews-api.com/api/v1?tickers=${coin}&items=3&token=${process.env.CRYPTO_NEWS_API_KEY}`

    try {
        const response = await axios.get(url);
    

        return new Response(JSON.stringify(response.data), {status: 201})
    } catch (error) {
        return new Response("Failed to get news", { status: 500 })
    }
}