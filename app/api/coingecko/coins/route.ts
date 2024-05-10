import axios from "axios";

export const GET = async (req: Request, res: Response) => {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"

    try {
        const response = await axios.get(url);
    
        return new Response(JSON.stringify(response.data), {status: 201})
    } catch (error) {
        return new Response("Failed to get coins", { status: 500 })
    }
}