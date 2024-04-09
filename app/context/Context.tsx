"use client"
import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext<any>({} as any);

const ContextProvider = (props: any) => {
    const [input, setInput] = useState<string>("");
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
        let response;
        if(prompt !== undefined) {
            response = await runChat(prompt)
            setRecentPrompt(prompt);
        } else {
            setPrevPromts(prev=>[...prev, input]);
            setRecentPrompt(input);
            response = await runChat(input)
        }
        let responseArray = response.split("**");
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