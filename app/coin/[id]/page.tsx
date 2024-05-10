"use client"
import React, { useEffect, useState } from "react";
import LineChart from "../../../components/CoinPage/LineChart";
import SelectDays from "../../../components/CoinPage/SelectDays";
import ToggleComponents from "../../../components/CoinPage/ToggleComponent";
import Button from "../../../components/Common/Button";
import Header from "../../../components/Common/Header";
import Loader from "../../../components/Common/Loader";
import List from "../../../components/Dashboard/List";
import { getCoinData } from "../../../functions/getCoinData";
import { getPrices } from "../../../functions/getPrices";
import { settingChartData } from "../../../functions/settingChartData";
import { settingCoinObject } from "../../../functions/settingCoinObject";
import News from "@/components/CoinPage/News";
import { getCoinNews } from "@/functions/getCoinNews";

type Props = {
  params: { id: string }
}

const Coin = ({ params: { id } }: Props) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{}] });
  const [coin, setCoin] = useState<any>({});
  const [coinNews, setCoinNews] = useState<string[]>([]);
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  useEffect(() => {
    getNews()
  }, [coin?.symbol])

  const getData = async () => {
    setLoading(true);
    let coinData = await getCoinData(id, setError);
    console.log("Coin DATA>>>>", coinData);
    settingCoinObject(coinData, setCoin);
    if (coinData) {
      const prices = await getPrices(id, days, priceType, setError);
      if (prices) {
        settingChartData(setChartData, prices);
        setLoading(false);
      }
    }
  };

  const getNews = async () => {
    setLoading(true);
    try {
      let response = await getCoinNews(coin?.symbol, setError);
      console.log("Coin News Response:", response.data);
      if (response) {
        setCoinNews(response.data);
      } else {
        console.warn("Expected an array, but got:", response.data);
        setError(true);
      }
    } catch (e) {
      console.error("Error fetching coin news:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDaysChange = async (event: any) => {
    setLoading(true);
    setDays(event.target.value);
    const prices = await getPrices(id, event.target.value, priceType, setError);
    if (prices) {
      settingChartData(setChartData, prices);
      setLoading(false);
    }
  };

  const handlePriceTypeChange = async (event: any) => {
    setLoading(true);
    setPriceType(event.target.value);
    const prices = await getPrices(id, days, event.target.value, setError);
    if (prices) {
      settingChartData(setChartData, prices);
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      {!error && !loading && coin.id ? (
        <>
          <div className="grey-wrapper">
            <List coin={coin} delay={0.5} />
          </div>
          <div className="grey-wrapper">
            <SelectDays handleDaysChange={handleDaysChange} days={days} />
            <ToggleComponents
              priceType={priceType}
              handlePriceTypeChange={handlePriceTypeChange}
            />
            <LineChart chartData={chartData} />
          </div>
          <div className="news-wrapper">
            {coinNews?.map((news: any) => (
              <News news={news} key={1} delay={(1 % 4) * 0.2}/>
            ))}
          </div>
        </>
      ) : error ? (
        <div>
          <h1 style={{ textAlign: "center" }}>
           {`Sorry, Couldn't find the coin you're looking for 😞`}
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "2rem",
            }}
          >
            <a href="/">
              <Button text="Dashboard" onClick={() => {}} />
            </a>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Coin;