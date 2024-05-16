"use client"
import { KeyboardEvent, useContext } from 'react';
import "./Main.css"
import Image from 'next/image';
import { Context } from '@/context/Context';
import { assets } from '@/assets/assets';
import Header from '../Common/Header';

const Main = () => {
    const {onSent, recentPrompt, showResult, loading, resultData, setInput, input} = useContext(Context);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSent();
            setInput("")
        }
    };

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
                        <div className="card">
                            <p>Give the last 3 transactions for vitalik.eth</p>
                            <Image src={assets.compass_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Use Etherscan to call owner() on the Bored Ape YC contract</p>
                            <Image src={assets.bulb_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Does crypto-kevin.eth hold any VPP on base?</p>
                            <Image src={assets.message_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>What does EOAs stand for in the blockchain world?</p>
                            <Image src={assets.code_icon} alt="" />
                        </div>
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