"use client"
import runChat from "@/config/openai";
import { createContext, useState } from "react";
// import runChat from "../config/gemini";

export const Context = createContext<any>({} as any);

interface ChatLog {
    prompt: string;
    resultData?: string;
    loading: boolean
}

const ContextProvider = (props: any) => {
    const [input, setInput] = useState<string>("");
    const [chatLog, setChatLog] = useState<ChatLog[]>([]);
    const [recentPrompt, setRecentPrompt] = useState<string>("");
    const [prevPrompts, setPrevPromts] = useState<string[]>([]);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [resultData, setResultData] = useState<string>("");

    const delayPara = (index: number, nextWord: string) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index)
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt: string) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response: any;
        if(prompt !== undefined) {
            console.log(prompt)
            setChatLog([...chatLog, { prompt: prompt, loading: true }]);
            setRecentPrompt(prompt);
            response = await runChat(prompt)
            let responseArray = response.split("**");
            console.log(responseArray)
            let newResponse = '';
            for(let i = 0; i < responseArray.length;  i++) {
                if(i === 0 || i%2 !== 1) {
                    newResponse += responseArray[i]
                } else {
                    newResponse += "<b>"+responseArray[i]+"</b>"
                }
            }
            let newResponse2 = newResponse.split("\n\n").join("</br>");
            setChatLog(prevChatLog =>
                prevChatLog.map(chat =>
                    chat.prompt === prompt ? { ...chat, resultData: newResponse2, loading: false } : chat
                )
            );
        } else {
            setPrevPromts(prev=>[...prev, input]);
            setRecentPrompt(input);
            setChatLog([...chatLog, { prompt: input, loading: true }]);
            response = await runChat(input)
            let responseArray = response.split("**");
            console.log(responseArray)
            let newResponse = '';
            for(let i = 0; i < responseArray.length;  i++) {
                if(i === 0 || i%2 !== 1) {
                    newResponse += responseArray[i]
                } else {
                    newResponse += "<b>"+responseArray[i]+"</b>"
                }
            }
            let newResponse2 = newResponse.split("\n\n").join("</br>");
            setChatLog(prevChatLog =>
                prevChatLog.map(chat =>
                    chat.prompt === input ? { ...chat, resultData: newResponse2, loading: false } : chat
                )
            );
        }
        let responseArray = response.split("**");
        console.log(responseArray)
        let newResponse = '';
        for(let i = 0; i < responseArray.length;  i++) {
            if(i === 0 || i%2 !== 1) {
                newResponse += responseArray[i]
            } else {
                newResponse += "<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>");
        let newResponseArray = newResponse2.split(" ");
        for(let i = 0;  i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord+" ");
        }
        setLoading(false)
        setInput("")
    }

    const contextValue = {
        prevPrompts,
        setPrevPromts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        chatLog,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;