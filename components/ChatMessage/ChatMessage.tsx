"use client"
import React from 'react'
import { assets } from '@/assets/assets';
import Image from 'next/image';
import "./ChatMessage.css"

interface ChatMessageProps {
    prompt: any
    loading: boolean
    resultData: string
}

const ChatMessage = ({ prompt, loading, resultData }: ChatMessageProps) => {
  return (
    <div className='result'>
        <div className="result-title">
            <Image src={assets.mgoes_icon} alt="" />
            <p>{prompt}</p>
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
  )
}

export default ChatMessage