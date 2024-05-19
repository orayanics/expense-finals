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
          `
https://v6.exchangerate-api.com/v6/0218e1b3fec7885b4531ee7f/latest/USD`
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
    return <div className="exchange-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="exchange-container">
        Error fetching data: {error.message}
      </div>
    );
  }

  return (
    <>
      <p className="dashboard-title-date">Exchange Rates</p>
      <div className="exchange-container">
        {Object.keys(exchangeRates).map((currency) => (
          <div key={currency} className="dashboard-card">
            <p className="exchange-money">{exchangeRates[currency]}</p>
            <p className="exchange-title">{currency}</p>
          </div>
        ))}
      </div>
    </>
  );
}
