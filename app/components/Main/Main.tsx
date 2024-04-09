"use client"
import { useContext } from 'react';
import { assets } from '../../assets/assets';
import "./Main.css"
import { Context } from '../../context/Context';
import Image from 'next/image';

const Main = () => {
    const {onSent, recentPrompt, showResult, loading, resultData, setInput, input} = useContext(Context);

  return (
    <div className='main'>
        <div className="nav">
            <p>Devin</p>
            <Image src={assets.user_icon} alt="" />
        </div>
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
                            <p>Suggest beautiful places to see on an upcoming road trip</p>
                            <Image src={assets.compass_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Briefly summarize this concept: urban planning</p>
                            <Image src={assets.bulb_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Brainstorm team bonding activities for our work retreat</p>
                            <Image src={assets.message_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Improve the readability of the following code</p>
                            <Image src={assets.code_icon} alt="" />
                        </div>
                    </div>
                </>
                :
                <div className='result'>
                    <div className="result-title">
                        <Image src={assets.user_icon} alt="" />
                        <p>{recentPrompt}</p>
                    </div>
                    <div className='result-data'>
                        <Image src={assets.gemini_icon} alt="" />
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
                    <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
                    <div>
                        <Image src={assets.gallery_icon} alt="" />
                        <Image src={assets.mic_icon} alt="" />
                        {input ? <Image onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                    </div>
                </div>
                <p className="bottom-info">
                    Devin may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps.
                </p>
            </div>
        </div>
    </div>
  )
}

export default Main