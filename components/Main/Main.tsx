"use client"
import { useContext, useState } from 'react';
import "./Main.css"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from "lucide-react"
  
import Image from 'next/image';
import { Context } from '@/context/Context';
import { Button } from '@/components/ui/button';
import { assets } from '@/assets/assets';
import Link from 'next/link';
import Header from '../Common/Header';

const Main = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const {onSent, recentPrompt, showResult, loading, resultData, setInput, input} = useContext(Context);

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
                    {/* <Collapsible
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className="space-y-2"
                    >
                        <div className="flex greet items-center justify-between space-x-4 px-4">
                            <span className="text-2xl font-semibold">
                                What would you like to do?
                            </span>
                            <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 p-0">
                                <ChevronsUpDown className="h-4 w-4" color='#000' />
                                <span className="sr-only">Toggle</span>
                            </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                            <div className="cards">
                                <Link href={"/dashboard"} className="card">
                                    <p>Give the last 3 transactions for vitalik.eth</p>
                                    <Image src={assets.compass_icon} alt="" />
                                </Link>
                                <Link href={"/dashboard"} className="card">
                                    <p>Use Etherscan to call owner() on the Bored Ape YC contract</p>
                                    <Image src={assets.bulb_icon} alt="" />
                                </Link>
                                <Link href={"/dashboard"} className="card">
                                    <p> Does crypto-kevin.eth hold any VPP on base?</p>
                                    <Image src={assets.message_icon} alt="" />
                                </Link>
                                <Link href={"/dashboard"} className="card">
                                    <p>what's the hype about base</p>
                                    <Image src={assets.code_icon} alt="" />
                                </Link>
                            </div>
                        </CollapsibleContent>
                    </Collapsible> */}
                    {/* <div className="max-w-2xl mx-auto py-4">
                        <div className='flex items-center space-x-4'>
                            <span className='text-sm font-medium'>Try searching</span>
                            <div className="flex items-center justify-center space-x-4">
                                <button className="flex items-center text-xs px-1 py-1 border rounded-full hover:bg-[#dfe4ea]">
                                    Give the last 3 transactions for vitalik.eth
                                </button>
                                <button className="flex items-center text-xs px-1 py-1 border rounded-full hover:bg-[#dfe4ea]">
                                    Use Etherscan to call owner() on the Bored Ape YC contract
                                </button>
                            </div>
                        </div>
                            <div className="flex items-center justify-center space-x-4 mt-4">
                            <button className="flex items-center text-xs px-1 py-1 border rounded-full hover:bg-[#dfe4ea]">
                                Does crypto-kevin.eth hold any VPP on base?
                            </button>
                            <button className="flex items-center px-1 text-xs py-1 border rounded-full hover:bg-[#dfe4ea]">
                                what's the hype about base
                            </button>
                        </div>
                    </div> */}
                </>
                :
                <div className='result'>
                    <div className="result-title">
                        <Image src={assets.user_icon} alt="" />
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
                    <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
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