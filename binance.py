# get the current price on binance, compare the current price of the xrp-usdt pair with 
# the highest xrp price in the last hour and, if it has fallen by 1%, output a message 
# to the terminal
from os import getenv 
from dotenv import load_dotenv
from binance import Client

load_dotenv()

api_key = getenv('binance_api_key')
secret_key = getenv('secret_key')

client = Client(api_key, secret_key)

klines = client.get_historical_klines(
    "XRPUSDT", Client.KLINE_INTERVAL_1MINUTE, "1 hour ago UTC"
    )
highest_price = max([float(i[2]) for i in klines])

while(True):
    current_candle_max_price = float(client.get_klines(
        symbol='XRPUSDT', interval=Client.KLINE_INTERVAL_1MINUTE
        )[-1][4])
    if current_candle_max_price > highest_price:
        highest_price = current_candle_max_price
    if highest_price - highest_price/100 <= current_candle_max_price:
        print("цена упала на 1% от максимальной цены за последний час")
