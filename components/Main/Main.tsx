"use client"
import { KeyboardEvent, useContext } from 'react';
import "./Main.css"
import Image from 'next/image';
import { Context } from '@/context/Context';
import { assets } from '@/assets/assets';
import Header from '../Common/Header';

const prompts = [
    {
        id: 1,
        prompt: "Give the wallet address for crypto-kevin.eth",
        icon: assets.compass_icon
    },
    {
        id: 2,
        prompt: "Give the last 3 transactions for vitalik.eth",
        icon: assets.bulb_icon
    },
    {
        id: 3,
        prompt: "Use Etherscan to call owner() on the Bored Ape YC contract",
        icon: assets.message_icon
    },
    {
        id: 4,
        prompt: "Does crypto-kevin.eth hold any VPP on base?",
        icon: assets.code_icon
    },
]

const Main = () => {
    const {onSent, recentPrompt, setRecentPrompt, showResult, loading, resultData, setInput, input} = useContext(Context);

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            await onSent();
            setInput("")
        }
    };

    const selectPrompt = async (prompt: string) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
        setInput("")
    }

  return (
    <div className='main'>
        <Header />
        <div className="main-container">
            {!showResult 
                ? 
                <>
                    <div className="greet">
                        <p><span>Hello, Kevin.</span></p>
                        <p>How can I help you today?</p>
                    </div>
                    <div className="cards">
                        {prompts?.map((item) => (
                            <div className="card" onClick={() => selectPrompt(item.prompt)} key={item.id}>
                                <p>{item.prompt}</p>
                                <Image src={item.icon} alt="" />
                            </div>
                        ))}
                    </div>
                </>
                :
                <div className='result'>
                    <div className="result-title">
                        <Image src={assets.mgoes_icon} alt="" />
                        <p>{recentPrompt}</p>
                    </div>
                    <div className='result-data'>
                        <Image src={assets.wallet_chat} alt="" />
                        {loading ? 
                            <div className='loader'>
                                <hr />
                                <hr />
                                <hr />
                            </div>
                            :
                            <p dangerouslySetInnerHTML={{__html: resultData}}></p>
                        }
                    </div>
                </div> 
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