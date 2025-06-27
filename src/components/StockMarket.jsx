import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

const API_KEY = 'd1f2g0hr01qsg7da02u0d1f2g0hr01qsg7da02ug';
const SOCKET_URL = `wss://ws.finnhub.io?token=${API_KEY}`;
const SYMBOLS = [
  'BINANCE:BTCUSDT',
  'BINANCE:ETHUSDT',
  'BINANCE:SOLUSDT',
  'BINANCE:BNBUSDT',
  'BINANCE:XRPUSDT',
  'BINANCE:ADAUSDT',
  'BINANCE:DOGEUSDT',
  'BINANCE:DOTUSDT',
  'BINANCE:SHIBUSDT',
  'OANDA:XAU_USD', // Gold
  'OANDA:XAG_USD', // Silver
];

const LivePriceScreen = () => {
  const socketRef = useRef(null);
  const [priceData, setPriceData] = useState({}); // format: { symbol: { current, previous } }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = new WebSocket(SOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WebSocket connected');
      SYMBOLS.forEach(symbol => {
        socket.send(JSON.stringify({ type: 'subscribe', symbol }));
      });
    };

    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.type === 'trade' && message.data?.length > 0) {
        setPriceData(prevData => {
          const updatedData = { ...prevData };
          message.data.forEach(trade => {
            const symbol = trade.s;
            const price = trade.p;
            const previous = updatedData[symbol]?.current || price;
            updatedData[symbol] = {
              current: price,
              previous: previous,
            };
          });
          return updatedData;
        });
        setLoading(false);
      }
    };

    socket.onerror = error => {
      console.error('❌ WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket closed');
    };

    return () => {
      SYMBOLS.forEach(symbol => {
        socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
      });
      socket.close();
    };
  }, []);

  const getPriceColor = symbol => {
    const data = priceData[symbol];
    if (!data) return styles.priceNeutral;
    if (data.current > data.previous) return styles.priceUp;
    if (data.current < data.previous) return styles.priceDown;
    return styles.priceNeutral;
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>📈 Live Market Prices</Text> */}

      {loading ? (
        <ActivityIndicator size="large" color="#4caf50" />
      ) : (
        <FlatList
          data={SYMBOLS}
          keyExtractor={item => item}
          renderItem={({ item }) => {
            const priceInfo = priceData[item];
            const price = priceInfo?.current;
            return (
              <View style={styles.row}>
                <Text style={styles.symbol}>{item}</Text>
                <Text style={[styles.price, getPriceColor(item)]}>
                  {price !== undefined ? `$${price.toFixed(2)}` : 'Loading...'}
                </Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default LivePriceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  symbol: {
    fontSize: 18,
    color: '#ddd',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceUp: {
    color: '#4caf50', // green
  },
  priceDown: {
    color: '#f44336', // red
  },
  priceNeutral: {
    color: '#ccc', // neutral gray
  },
});
