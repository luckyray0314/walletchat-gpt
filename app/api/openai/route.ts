import OpenAI from "openai";
import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';
import { ChatCompletionTool } from "openai/resources/index.mjs";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const functions: ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "resolve_ens_name",
            description: "Resolve the given ENS name to an Ethereum address",
            parameters: {
                type: "object",
                properties: {
                    ensName: {
                        type: "string",
                        description: "The ENS name to resolve",
                        enum: ["crypto-kevin.eth"]
                    }
                },
                required: ["ensName"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_wallet_info",
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
                        description: "The action to perform (balance, txlist, tokentx, etc.)",
                        enum: ["balance", "txlist", "tokentx"]
                    }
                },
                required: ["address", "action"]
            }
        }
    }
];

export const POST = async (req: NextRequest, res: NextResponse) => {
    const { message } = await req.json()
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { 
                    role: "system",
                    content: "Perform function requests for the user" 
                },{
                    role: "user",
                    content: message
                }
            ],
            tools: functions,
            tool_choice: "auto",
        });

        const responseMessage = completion.choices[0].message;

        // Step 2: check if the model wanted to call a function
        if (responseMessage.tool_calls) {
            const toolCalls = responseMessage.tool_calls;
            // Step 3: call the function
            // Note: the JSON response may not always be valid; be sure to handle errors
            const availableFunctions: any = {
                resolve_ens_name: resolveEnsNameToAddress,
                get_wallet_info: getWalletInfo,
            }; // only one function in this example, but you can have multiple

            // messages.push(responseMessage); // extend conversation with assistant's reply
            
            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionToCall = availableFunctions[functionName];
                const functionArgs = JSON.parse(toolCall.function.arguments);
                const functionResponse = await functionToCall(functionArgs);
                // messages.push({
                //     tool_call_id: toolCall.id,
                //     role: "tool",
                //     name: functionName,
                //     content: functionResponse,
                // }); // extend conversation with function response

                console.log(functionArgs)
                console.log(functionResponse)

                return new NextResponse(JSON.stringify(functionResponse), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        }
        
        // const thread = openai.beta.threads.create();
        // const response = openai.beta.threads.messages.create(thread.id, {
        //     role: "user",
        //     content: message,
        // });
        return new NextResponse(JSON.stringify(responseMessage.content), {
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
}


// ENS name resolving function
async function resolveEnsNameToAddress({ ensName }: { ensName: string }) {
    const baseUrl = 'https://api.v2.walletchat.fun';
    const response = await axios.get(`${baseUrl}/resolve_name/${ensName}`);
    if (response.status === 200) {
        return `The Ethereum address for ${ensName} is ${response.data.address}`;
    } else {
        throw new Error(`Failed to resolve ENS name. Status code: ${response.status}`);
    }
}

// Get Wallet Info using Etherscan
async function getWalletInfo({address, action}: { address: string, action: string }) {
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