import axios from "axios";

export const GET = async (req: Request, res: Response) => {
    // const { address } = await req.json();

    const API_KEY = "FRGY7FHN3MQJ65A6GIVBD7WAX29TU8NCZW";
    const address = "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae";
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${API_KEY}`

    try {
        const response = await axios.get(url);
    

        return new Response(JSON.stringify(response.data), {status: 201})
    } catch (error) {
        return new Response("Failed to egt a list of 'ERC20 - Token Transfer Events' by Address", { status: 500 })
    }
}