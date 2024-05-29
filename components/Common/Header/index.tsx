"use client"
import React, { useEffect, useState } from "react";
import Button from "../Button";
import TemporaryDrawer from "./drawer";
import "./styles.css";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import Alert from "../Alert";
import axios from "axios"; // Ensure axios is installed and imported
 
function Header() {
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    connectWallet();
  }, [isConnected, address])

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const isDark = localStorage.getItem("theme") === "dark";
      setDarkMode(isDark);
      if (isDark) {
        setDark();
      } else {
        setLight();
      }
    }
  }, []);

  useEffect(() => {
      if (localStorage.getItem("theme") == "dark") {
        setDark();
      } else {
        setLight();
      }
  }, []);

  const changeMode = (e: any) => {
      e.preventDefault();
      if (localStorage.getItem("theme") != "dark") {
        setDark();
      } else {
        setLight();
      }
      setDarkMode(!darkMode);
      toast.success("Theme Changed!");
  };

  const setDark = () => {
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
  };

  const setLight = () => {
      localStorage.setItem("theme", "light");
      document.documentElement.setAttribute("data-theme", "light");
  };

  const connectWallet = async () => {
    const simulatedWalletAddress = `0x${Math.random().toString(16).slice(2, 10)}`;
    try {
      const response = await axios.post('/api/connectWallet', { walletAddress: simulatedWalletAddress });
      console.log(`Wallet connected: ${simulatedWalletAddress}`);
    } catch (error) {
      toast.error("Failed to connect wallet.");
      console.log("Error connecting wallet:", error);
    }
  };

  return (
    <div>
      {!isConnected && (
        <Alert />
      )}
      <div className="header">
        <a href="/">
          <h1 className="header-text">
            WalletChat AI<span style={{ color: "var(--blue)" }}>.</span>
          </h1>
        </a>
        <div className="links">
          <Switch checked={darkMode} onClick={(e) => changeMode(e)} />
          <a href="/">
            <p className="link">Home</p>
          </a>
          <a href="/dashboard">
            <p className="link">Coinlist</p>
          </a>
          {isConnected && (
            <div className="px-4 py-2 rounded-full bg-black text-white cursor-pointer" onClick={() => disconnect()}>
              <p className="text-white">{`${address?.slice(0, 7)}...${address?.slice(35)}`}</p>
            </div>
          )}
          {!isConnected && (
            <Button text={"connect wallet"} onClick={() => open()} />
          )}
        </div>
        <div className="drawer-component">
          <TemporaryDrawer />
        </div>
      </div>
    </div>
  );
}

export default Header;
