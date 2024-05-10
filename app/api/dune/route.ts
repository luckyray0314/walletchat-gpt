import axios from "axios";

export const GET = async (req: Request, res: Response) => {
    const options = {method: 'GET', headers: {'X-DUNE-API-KEY': 'iW8u56EWoFnlwn7RS93IgG1lXRBGrWWL'}}
    const url = `https://api.dune.com/api/v1/query/3680273/results`

    try {
        const response = await axios.get(url, options);
    

        return new Response(JSON.stringify(response.data), {status: 201})
    } catch (error) {
        return new Response("Failed to get query", { status: 500 })
    }
}