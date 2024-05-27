import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';

export const setWalletAddress = (res: NextResponse, address: string) => {
    // Serialize the cookie with the wallet address
    const cookieHeader = cookie.serialize('walletAddress', address, {
        path: '/',
        httpOnly: true,  // Makes the cookie inaccessible to client-side JavaScript (CSRF protection)
        secure: process.env.NODE_ENV === 'production',  // Only set cookies over HTTPS in production
        sameSite: 'strict',  // Strictly limit the cookie to the same site
        maxAge: 60 * 60 * 24 * 7 // 1 week in seconds
    });

    // Set the 'Set-Cookie' header on the response
    res.headers.set('Set-Cookie', cookieHeader);
    return res;
};

export const getWalletAddress = (req: NextRequest): string | null => {
    // Retrieve 'cookie' header using the .get() method
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookie.parse(cookieHeader || '');
    const walletAddress = cookies.walletAddress;
    console.log('Getting wallet address', walletAddress);
    return walletAddress || null;
};
