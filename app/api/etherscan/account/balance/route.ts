import axios from "axios";

export const GET = async (req: Request, res: Response) => {
    // const { address } = await req.json();

    const API_KEY = "FRGY7FHN3MQJ65A6GIVBD7WAX29TU8NCZW";
    const address = "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae";
    const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${API_KEY}`

    try {
        const response = await axios.get(url);
    

        return new Response(JSON.stringify(response.data), {status: 201})
    } catch (error) {
        return new Response("Failed to get balance of the address", { status: 500 })
    }
}