"use client"
import { KeyboardEvent, useContext } from 'react';
import "./Main.css"
import Image from 'next/image';
import { Context } from '@/context/Context';
import { assets } from '@/assets/assets';
import Header from '../Common/Header';
import ChatMessage from '../ChatMessage/ChatMessage';

const prompts = [
    {
        id: 1,
        prompt: "Give the wallet address for crypto-kevin.eth?",
        icon: assets.compass_icon
    },
    {
        id: 2,
        prompt: "What is the token overlap for PEPE on Ethereum?",
        icon: assets.bulb_icon
    },
    {
        id: 3,
        prompt: "Use etherscan to call the function owner() on the Bored Ape YC smart contract, use proxy module and eth_call action",
        icon: assets.message_icon
    },
    {
        id: 4,
        prompt: "get the portfolio for SOL wallet 8jnC8Zt9fpzUXUQQc12o1pwnJDZkixzLgWSPVJKpXEsK",
        icon: assets.code_icon
    },
]

const Main = () => {
    const {onSent, chatLog, setRecentPrompt, showResult, setInput, input} = useContext(Context);

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setInput("")
            await onSent();
        }
    };

    const selectPrompt = async (prompt: string) => {
        setRecentPrompt(prompt);
        setInput("")
        await onSent(prompt);
    }

  return (
    <div className='main'>
        <Header />
        <div className="main-container">
            {!showResult 
                ? 
                <>
                    <div className="greet">
                        {/* <p><span>Hello, Kevin.</span></p> */}
                        <p><span>How can I help you today?</span></p>
                    </div>
                    <div className="cards">
                        {prompts?.map((item) => (
                            <div className="card" onClick={() => selectPrompt(item.prompt)} key={item.id}>
                                <p>{`${item.prompt.slice(0, 100)}...`}</p>
                                <Image src={item.icon} alt="" />
                            </div>
                        ))}
                    </div>
                </>
                :
                <>
                    {chatLog?.map((item: any, i: number) => (
                        <ChatMessage key={i++} prompt={item?.prompt} loading={item?.loading} resultData={item?.resultData} />
                    ))}
                </>
            }
            
            <div className="main-bottom">
                <div className="search-box">
                    <input 
                        onChange={(e) => setInput(e.target.value)} 
                        value={input} type="text" 
                        placeholder='Enter a prompt here' 
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <div>
                        <Image src={assets.gallery_icon} alt="" />
                        <Image src={assets.mic_icon} alt="" />
                        {input ? <Image onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                    </div>
                </div>
                <p className="bottom-info">
                    WalletChat AI may display inaccurate info, including about people, so double-check its responses. Your privacy and WalletChat Apps.
                </p>
            </div>
        </div>
    </div>
  )
}

export default Main