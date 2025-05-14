const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const coins = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];

app.get('/api/arbitrage', async (req, res) => {
  try {
    const [binance, bybit] = await Promise.all([
      axios.get('https://api.binance.com/api/v3/ticker/price'),
      axios.get('https://api.bybit.com/v2/public/tickers')
    ]);

    const result = {};

    coins.forEach(symbol => {
      const binancePrice = binance.data.find(item => item.symbol === symbol)?.price;
      const bybitPrice = bybit.data.result.find(item => item.symbol === symbol)?.last_price;

      result[symbol] = {
        binance: binancePrice ? parseFloat(binancePrice) : null,
        bybit: bybitPrice ? parseFloat(bybitPrice) : null,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
});

app.listen(port, () => {
  console.log(`Сервер работает: http://localhost:${port}`);
});
