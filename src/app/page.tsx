
"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import TransactionItem from "@/components/TransactionItem";
import DailyStatItem from "@/components/DailyStatItem";

const apiKey = "19193389-443b-4d59-9dd9-500bde0931c7";
const secret = "ThLfVLGaY5CQQut";
const baseUrl = "https://api.rango.exchange/dapp-stats/";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const now = new Date();
    const to = now.getTime();
    const from = new Date(now.setMonth(now.getMonth() - 3)).getTime();

    axios.get(`${baseUrl}tx-detail?apiKey=${apiKey}&secret=${secret}&from=${from}&to=${to}`)
      .then((res) => {
        setTransactions(res.data.transactions);
      });

    axios.get(`${baseUrl}daily-stats?apiKey=${apiKey}&secret=${secret}&from=${from}&to=${to}`)
      .then((res) => {
        setStats(res.data.stats);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="text-4xl p-4 text-center">Transaction Details</div>
      <div>
        {
          transactions.map((item, i) => {
            return <TransactionItem key={i} item={item} />
          })
        }
      </div>
      <div className="text-4xl p-4 text-center">Daily Stats</div>
      <div>
        {
          stats.map((item, i) => {
            return <DailyStatItem key={i} item={item} />
          })
        }
      </div>
    </main>
  );
}
