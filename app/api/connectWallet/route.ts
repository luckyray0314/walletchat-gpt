// pages/api/connectWallet.ts

import { NextRequest, NextResponse } from 'next/server';
import { getWalletAddress, setWalletAddress } from '../../../lib/walletstate'; // Correct the path as needed

interface SuccessResponse {
    success: boolean;
    message?: string;
    walletAddress?: string;
}

interface ErrorResponse {
    message: string;
}

// POST handler to set the wallet address
export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ message: 'Method Not Allowed' }), {
            status: 405,
            headers: {'Content-Type': 'application/json'}
        });
    }

    try {
        const body = await req.json();
        const { walletAddress } = body;
        if (typeof walletAddress === 'string') {
            console.log('Wallet address updated', walletAddress)
            let res = new NextResponse(JSON.stringify({ success: true, message: 'Wallet address updated', walletAddress }), {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            });
            setWalletAddress(res, walletAddress);
            return res;
        } else {
            return new NextResponse(JSON.stringify({ message: 'Invalid wallet address provided' }), {
                status: 400,
                headers: {'Content-Type': 'application/json'}
            });
        }
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Server error processing your request' }), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
}

// GET handler to retrieve the wallet address
export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return new NextResponse(JSON.stringify({ message: 'Method Not Allowed' }), {
            status: 405,
            headers: {'Content-Type': 'application/json'}
        });
    }

    console.log('GET wallet address called')

    try {
        const address = getWalletAddress(req);
        if (address) {
            console.log('Wallet address found', address)
            return new NextResponse(JSON.stringify({ success: true, walletAddress: address }), {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            });
        } else {
            return new NextResponse(JSON.stringify({ message: 'ConnectWallet: No wallet connected' }), {
                status: 404,
                headers: {'Content-Type': 'application/json'}
            });
        }
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Server error processing your request' }), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
}
