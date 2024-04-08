import axios from "axios";

export const GET = async (req: Request, res: Response) => {
    // const { address } = await req.json();

    const API_KEY = "FRGY7FHN3MQJ65A6GIVBD7WAX29TU8NCZW";
    const contractAddress = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2";
    const address = "0x4e83362442b8d1bec281594cea3050c8eb01311c"
    const url = `https://api.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${contractAddress}&address=${address}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${API_KEY}`

    try {
        const response = await axios.get(url);
    

        return new Response(JSON.stringify(response.data), {status: 201})
    } catch (error) {
        return new Response("Failed to egt a list of 'ERC20 - Token Transfer Events' filtered by token contract", { status: 500 })
    }
}