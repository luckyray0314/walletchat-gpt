import OpenAI from "openai";
import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';
import { Assistant } from "openai/resources/beta/assistants.mjs";
import { ChatCompletionTool } from "openai/resources/index.mjs";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const DUNE_API_KEY = process.env.DUNE_API_KEY;

const functions: ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "resolveEnsNameToAddress",
            description: "Resolve the given ENS name to an Ethereum address",
            parameters: {
                type: "object",
                properties: {
                    ensName: {
                        type: "string",
                        description: "The ENS name to resolve",
                    }
                },
                required: ["ensName"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "getWalletInfo",
            description: "Retrieve the ETH balance, transaction lists, and token transfers of a given wallet address using the Etherscan API",
            parameters: {
                type: "object",
                properties: {
                    address: {
                        type: "string",
                        description: "The Ethereum wallet address to retrieve information for"
                    },
                    action: {
                        type: "string",
                        description: "The action to perform (balance, txlist, tokentx)",
                        enum: ["balance", "txlist", "tokentx"]
                    }
                },
                required: ["address", "action"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "executeSolanaTokenOverlap",
            description: "Check what other tokens are held by the provided Solana token contract address.",
            parameters: {
                type: "object",
                properties: {
                    token_address: {
                        type: "string",
                        description: "Solana token address to use in the query."
                    }
                },
                required: ["token_address"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "executeSolanaTokenWalletProfitLoss",
            description: "Retrieve Profit or Loss for a given Solana Wallet Address in USD and sorted by time.",
            parameters: {
                type: "object",
                properties: {
                    wallet_address: {
                        type: "string",
                        description: "Solana wallet address to use in the query."
                    }
                },
                required: ["wallet_address"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "executeSolanaTokenOwnerInfo",
            description: "Return the owner, symbol, and token total supply for a given Solana token.",
            parameters: {
                type: "object",
                properties: {
                    token_address: {
                        type: "string",
                        description: "Solana token address to use in the query."
                    }
                },
                required: ["token_address"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "executeEthereumTokenOverlap",
            description: "Check what other tokens are held by the provided Ethereum token contract address.",
            parameters: {
                type: "object",
                properties: {
                    token_address: {
                        type: "string",
                        description: "Ethereum token address to use in the query."
                    }
                },
                required: ["token_address"]
            }
        }
    }
];

let threadId: string;  // Store the thread ID
const conversations: any = {};  // In-memory store for conversations

let assistant: Assistant;

const initializeAssistant = async () => {
    if (!assistant) {
        assistant = await openai.beta.assistants.create({
            name: "Crypto Assistant",
            instructions: "You are a cryptocurrency analyst, use the provided functions to answer questions as needed.",
            tools: functions,
            model: "gpt-4o",
        });
    }
};

const executeFunction = async (functionName: string, args: any) => {
    switch (functionName) {
        case "resolveEnsNameToAddress":
            return await resolveEnsNameToAddress(args);
        case "getWalletInfo":
            return await getWalletInfo(args);
        case "executeSolanaTokenOverlap":
        case "executeSolanaTokenWalletProfitLoss":
        case "executeSolanaTokenOwnerInfo":
        case "executeEthereumTokenOverlap":
            const executionId = await executeDuneQuery(functionName, args);
            return await pollQueryStatus(executionId);  // Polling for the status and then fetching results
        default:
            throw new Error(`Unknown function: ${functionName}`);
    }
};

// const checkStatusAndReturnMessages = async (threadId: string, runId: string) => {
//     return new Promise(async (resolve) => {
//         const interval = setInterval(async () => {
//             console.log(`Checking status of run: ${runId} for thread: ${threadId}`);
//             let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
//             if (runStatus.status === "completed") {
//                 clearInterval(interval);
//                 let messages = await openai.beta.threads.messages.list(threadId);
//                 const conversationHistory: any[] = [];
//                 messages.data.forEach((msg: any) => {
//                     const role = msg.role;
//                     const content = msg.content[0].text.value;
//                     conversationHistory.push({ role: role, content: content });
//                 });
//                 resolve(conversationHistory);
//             }
//         }, 2000); // Poll every 2 seconds
//     });
// };

const executeDuneQuery = async (functionName: string, args: any) => {
    const queryIds: any = {
        executeSolanaTokenOverlap: 3623869,
        executeSolanaTokenWalletProfitLoss: 3657856,
        executeSolanaTokenOwnerInfo: 3408648,
        executeEthereumTokenOverlap: 3615247
    };
    const queryId = queryIds[functionName];
    const endpoint = `https://api.dune.com/api/v1/query/${queryId}/execute`;
    const payload = {
        query_parameters: args,
        performance: "medium"
    };
    const response = await axios.post(endpoint, payload, {
        headers: {
            'x-dune-api-key': DUNE_API_KEY
        }
    });
    if (response.status === 200) {
        return response.data.execution_id;
    } else {
        throw new Error(`Failed to execute query. Status code: ${response.status}`);
    }
};

const pollQueryStatus = async (executionId: string) => {
    const endpoint = `https://api.dune.com/api/v1/execution/${executionId}/status`;
    try {
        while (true) {
            const response = await axios.get(endpoint, {
                headers: {
                    'x-dune-api-key': DUNE_API_KEY
                }
            });
            const data = response.data;
            if (data.state === "QUERY_STATE_COMPLETED") {
                return await getQueryResults(executionId);
            } else if (["QUERY_STATE_FAILED", "QUERY_STATE_CANCELLED", "QUERY_STATE_EXPIRED"].includes(data.state)) {
                throw new Error(`Query failed with state: ${data.state}`);
            }
            await new Promise(resolve => setTimeout(resolve, 2000)); // Poll every 2 seconds
        }
    } catch (error) {
        console.error(`Error while polling query status: ${error}`);
        throw error;
    }
};

const getQueryResults = async (executionId: string) => {
    const endpoint = `https://api.dune.com/api/v1/execution/${executionId}/results`;
    const response = await axios.get(endpoint, {
        headers: {
            'x-dune-api-key': DUNE_API_KEY
        }
    });
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Failed to fetch results: ${response.status}`);
    }
};

export const POST = async (req: NextRequest, res: NextResponse) => {
    await initializeAssistant();
    const { message } = await req.json();
    try {
        if (!threadId) {
            const thread = await openai.beta.threads.create();
            threadId = thread.id;
            conversations[threadId] = [];
        } else if (!conversations[threadId]) {
            conversations[threadId] = [];
        }

        const history = conversations[threadId];
        history.push({ role: 'user', content: message });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a cryptocurrency analyst. Use the provided functions to answer questions as needed." },
                { role: "user", content: message }
            ],
            functions: functions.map(f => f.function),
        });

        const functionCall = completion.choices[0].message.function_call;
        if (functionCall) {
            const functionName = functionCall.name;
            const args = JSON.parse(functionCall.arguments);
            const functionResult = await executeFunction(functionName, args);

            history.push({ role: 'assistant', content: functionResult });
            conversations[threadId] = history;

            const latestAssistantMessage = history?.filter((message: any) => message.role === 'assistant').pop();

            return new NextResponse(JSON.stringify(latestAssistantMessage?.content), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const userMessage = await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: message,
        });

        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistant.id,
            instructions: "Please address the user as Sir Bruv Degen.",
        });

        // const conversationHistory = await checkStatusAndReturnMessages(threadId, run.id);
        // conversations[threadId] = conversationHistory;

        const latestAssistantMessage = history.conversation
                .filter((message: any) => message.role === 'assistant')
                .pop();

        return new NextResponse(JSON.stringify({ threadId, conversation: latestAssistantMessage }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error during API call:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to get completion from OpenAI", details: error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};

// ENS name resolving function
async function resolveEnsNameToAddress({ ensName } : { ensName: string }) {
    console.log(`resolveEnsNameToAddress called with ensName: ${ensName}`);
    const baseUrl = 'https://api.v2.walletchat.fun';
    const response = await axios.get(`${baseUrl}/resolve_name/${ensName}`);
    if (response.status === 200) {
        return `The Ethereum address for ${ensName} is ${response.data.address}`;
    } else {
        throw new Error(`Failed to resolve ENS name. Status code: ${response.status}`);
    }
}

// Get Wallet Info using Etherscan
async function getWalletInfo({ address, action }:{ address: string, action: string }) {
    console.log(`getWalletInfo called with address: ${address}, action: ${action}`);
    const baseUrl = 'https://api.etherscan.io/api';
    const apiKey = process.env.ETHERSCAN_API_KEY;
    const response = await axios.get(baseUrl, {
        params: {
            module: 'account',
            action: action,
            address: address,
            apikey: apiKey
        }
    });
    if (response.status === 200) {
        return `The ${action} for this address: ${address} is ${response.data.result}`;
    } else {
        throw new Error(`Failed to retrieve wallet info. Status code: ${response.status}`);
    }
}