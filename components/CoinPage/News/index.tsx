import React from "react";
import "./styles.css";
import { motion } from "framer-motion";

interface Props {
    news: any;
    delay: number
}

function News({ news, delay }: Props) {
  return (
    <a  target="_blank" href={`${news?.news_url}`}>
      <motion.div
        className={`grid ${news?.sentiment === "Negative" && "grid-red"}`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
      >
        <div className="img-flex">
          <img src={news?.image_url} className="coin-image" />
          <div className="icon-flex">
            <div className="info-flex">
              <span className="coin-symbol">{news?.source_name}</span>
              <span className="coin-name">{news?.title}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </a>
  );
}

export default News;