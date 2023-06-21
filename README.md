# Stock Price Checker

This is the boilerplate for the Stock Price Checker project. Instructions for building your project can be found at https://freecodecamp.org/learn/information-security/information-security-projects/stock-price-checker

# [freeCodeCamp Information Security certification](https://www.freecodecamp.org/learn/information-security/)

## [Stock Price Checker](https://freecodecamp.org/learn/information-security/information-security-projects/stock-price-checker)

Working example: https://app-stock-price-checker.webdev.priv.pl/

My git repo: https://github.com/Raff1010X/01.Roadmap

```javascript
const Stock = require('./stockModel')
const fetch = require('node-fetch');
const ip = require("ip")
const bcrypt = require('bcryptjs')
const address = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/`

const hashIp = async (ip) => bcrypt.hash(ip, 6).then((hash) => hash)

const compareIp = (ip, ipArr) => {
  for (let i = 0; i < ipArr.length; i++)
    if (bcrypt.compareSync(ip, ipArr[i]) == true)
      return true
  return false
}

async function getLikes(stock, like) {
  let myIp = await hashIp(ip.address())
  let find = await Stock.findOne({ name: stock })
  if (find) {
    const compare = compareIp(ip.address(), find.ips)
    if (like === 'true' && !compare) 
      find.ips.push(myIp)
  } else {
    let ips = []
    if (like === 'true') 
      ips = [myIp]
    find = new Stock({name: stock, ips})
  }
  find.save()
  return find.ips.length
}

exports.fetchOne = async (req, res, next) => {
  let {stock, like} = req.query;
  let likes = await getLikes(stock, like)
  let response = await fetch(`${address}${stock}/quote`)
  let data = await response.json();
  let doc = { stockData: {stock: data.symbol, price: data.latestPrice, likes} };
  res.status(200).json(doc);
};

exports.fetchTwo = async (req, res, next) => {
  let {stock, like} = req.query;
  let likes_1 = await getLikes(stock[0], like)
  let likes_2 = await getLikes(stock[1], like)
  let likes = likes_1 - likes_2
  let urls = [`${address}${stock[0]}/quote`, `${address}${stock[1]}/quote`]
  let data = await Promise.all(urls.map((url) => fetch(url).then((res) => res.json())))
  let doc = {stockData:[{stock:data[0].symbol, price: data[0].latestPrice, rel_likes: likes},
                        {stock:data[1].symbol, price: data[1].latestPrice, rel_likes: -likes}]}
  res.status(200).json(doc)
};
```