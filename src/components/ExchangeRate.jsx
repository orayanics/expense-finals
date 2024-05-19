import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ExchangeRate() {
      const [exchangeRates, setExchangeRates] = useState({});
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchExchangeRates = async () => {
          try {
            const response = await axios.get(
              `/api/v6/0218e1b3fec7885b4531ee7f/latest/USD`
            );
            const rates = response.data.conversion_rates;
            // Filter to only include specific currencies
            const filteredRates = {
              PHP: rates.PHP,
              USD: rates.USD,
              EUR: rates.EUR,
              KRW: rates.KRW,
              JPY: rates.JPY,
            };
            setExchangeRates(filteredRates);
            setLoading(false);
          } catch (err) {
            setError(err);
            setLoading(false);
          }
        };

        fetchExchangeRates();
      }, []);

      if (loading) {
        return <div className="exchange-rate-container">Loading...</div>;
      }

      if (error) {
        return (
          <div className="exchange-rate-container">
            Error fetching data: {error.message}
          </div>
        );
      }

  return (
    <div className="exchange-rate-container">
      <h1>Exchange Rates</h1>
      <ul>
        {Object.keys(exchangeRates).map((currency) => (
          <li key={currency}>
            <span>{currency}</span>
            <span>{exchangeRates[currency]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
