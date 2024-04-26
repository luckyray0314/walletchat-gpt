"use client"
import { useContext, useState } from 'react';
import "../../../../components/Main/Main.css"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from "lucide-react"
import Iframe from 'react-iframe'
  
import Image from 'next/image';
import { Context } from '@/context/Context';
import { Button } from '@/components/ui/button';
import { assets } from '@/assets/assets';

const DashboardPage = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const {onSent, recentPrompt, showResult, loading, resultData, setInput, input} = useContext(Context);

  return (
    <div className='main'>
        <div className="nav">
            <p>WalletChat AI</p>
            <Image src={assets.user_icon} alt="" />
        </div>
        <div className="main-container flex flex-row">
            {!showResult 
            
                ? 
                <>
                    <Collapsible
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className="space-y-2"
                    >
                        <div className="flex greet items-center justify-between space-x-4 px-4">
                            <span className="text-2xl font-semibold">
                              ezETH - Renzo Protocol
                            </span>
                            <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 p-0">
                                <ChevronsUpDown className="h-4 w-4" color='#000' />
                                <span className="sr-only">Toggle</span>
                            </Button>
                            </CollapsibleTrigger>
                        </div>
                        <div className="rounded-md border px-4 py-3 font-mono text-sm">
                          Renzo is a Liquid Restaking Token (LRT) and Strategy Manager for EigenLayer.
                        </div>
                    </Collapsible>
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
            
            <Iframe url="https://dune.com/maybeYonas/renzo-protocol"
              width="640px"
              height="320px"
              id=""
              className=""
              display="block"
              position="relative"
            />
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

export default DashboardPage