const NodeCache = require("node-cache");
const express = require("express");
const axios = require("axios");
const urlParam = require("url");
require("dotenv").config();

const app = express();
const port = 3000;

// SNOWTRACE API Key
const apiKey = process.env.SNOWTRACE_API_KEY;
const apiKeyEth = process.env.ETHERSCAN_API_KEY;

const cache = new NodeCache({ stdTTL: 600 }); // Set the cache expiration time to 600 seconds (10 minutes)

// Contract address of NAI token
const naiContractAddress = "0x5Ac34C53A04B9aaA0BF047e7291fb4e8A48f2A18";

// List of contract addresses with additional information
const contractAddresses = [
  {
    address: "0x0310Da0D8fF141166eD47548f00c96464880781F",
    chain: "AVAX",
    type: "Vesting",
    wallet: "Main Vesting",
  },
  {
    address: "0x9D8d4d46573278E3fcB9a1ff340e2175669B2cFe",
    chain: "AVAX",
    type: "Staking",
    wallet: "Nuklai Staking Campaign",
  },
  {
    address: "0x09B2ae782eF99c7778250BDAe12BCC9EF48a1b4F",
    chain: "ETH",
    type: "Staking",
    wallet: "DUA Staking Campaign",
  },
  {
    address: "0x74816789897C4ddE2eAA86771eCA72f92097c4E7",
    chain: "ETH",
    type: "Staking",
    wallet: "DUA Staking Campaign",
  },
  {
    address: "0x7230168E8f93ea7F1CD9b70C0D9eD0AE94224813",
    chain: "ETH",
    type: "Staking",
    wallet: "DUA Staking Campaign",
  },
  {
    address: "0x6613438c01AF8F22554e6c7Eb6281acED3990839",
    chain: "ETH",
    type: "Staking",
    wallet: "DUA Staking Campaign",
  },
  {
    address: "0x1bc8FC30c499f30e85E37F2AE544DdEEAe52C44c",
    chain: "ETH",
    type: "Staking",
    wallet: "1 Month Staking Campaign",
  },
  {
    address: "0x374300eFFCc6e8cDBCB47dB7D2736628789E9921",
    chain: "ETH",
    type: "Staking",
    wallet: "3 Month Staking Campaign",
  },
  {
    address: "0xe746d677090fDae0813c6B37012827F382f006D0",
    chain: "ETH",
    type: "Staking",
    wallet: "6 Month Staking Campaign",
  },
  {
    address: "0xf29093e35174a8C3c48605F6313Bc4723f7689A2",
    chain: "ETH",
    type: "Staking",
    wallet: "12 Month Staking Campaign",
  },
  {
    address: "0x836b8ebB4E135F82C96aa60F415b4B18D972a4B9",
    chain: "AVAX",
    type: "Fundrs",
    wallet: "Fundrs",
  },
  {
    address: "0xcbA3c4Dc5CA03d67643Cbb817E39B6D2e7d2F963",
    chain: "AVAX",
    type: "Multisig",
    wallet: "Multisig",
  },
  {
    address: "0x0A27A6Ea9d8621423c1AFF1f84d06b4cf2F5f6e7",
    chain: "AVAX",
    type: "IDO",
    wallet: "WeWay",
  },
  {
    address: "0xa583c6725f935c64Fd1ab27303305DF946e9e5b9",
    chain: "AVAX",
    type: "IDO",
    wallet: "Ape",
  },
  {
    address: "0xe95D5A9e3CD46D717939B5B9175e047Fd56910fd",
    chain: "AVAX",
    type: "IDO",
    wallet: "ChainGPT Pad",
  },
  {
    address: "0xbB140F0F582801e88DEdc516691B0950ACDeD5c1",
    chain: "AVAX",
    type: "Staking",
    wallet: "Hypergrowth Activation Staking Campaign",
  },
  {
    address: "0x5e5cDE7c8C79C06D29A2DCEF6f4EE9E248E033cc",
    chain: "AVAX",
    type: "Claim Portal",
    wallet: "Nuklai Claim Portal Locked Tokens",
  },
  {
    address: "0x087CcEF97b666d37a0407739ffF11B9e818E1BAE",
    chain: "AVAX",
    type: "Claim Portal",
    wallet: "Nuklai Claim Portal",
  },
  {
    address: "0x9526c03a87465b11618ad7c2671343e73a2cba92",
    chain: "AVAX",
    type: "Vesting",
    wallet: "Vesting",
  },
  {
    address: "0xe160898fd18ee4075c210703e29925f937d58bf5",
    chain: "AVAX",
    type: "Vesting",
    wallet: "Vesting",
  },
];

// List of contract addresses with additional information
const contractAddressesCMC = [
  {
    address: "0x0310Da0D8fF141166eD47548f00c96464880781F",
    chain: "AVAX",
    type: "Vesting",
    wallet: "Main Vesting",
  },
  {
    address: "0x9D8d4d46573278E3fcB9a1ff340e2175669B2cFe",
    chain: "AVAX",
    type: "Staking",
    wallet: "Nuklai Staking Campaign",
  },
  {
    address: "0x09B2ae782eF99c7778250BDAe12BCC9EF48a1b4F",
    chain: "ETH",
    type: "Staking",
    wallet: "DUA Staking Campaign",
  },
  {
    address: "0x74816789897C4ddE2eAA86771eCA72f92097c4E7",
    chain: "ETH",
    type: "Staking",
    wallet: "DUA Staking Campaign",
  },
  {
    address: "0x7230168E8f93ea7F1CD9b70C0D9eD0AE94224813",
    chain: "ETH",
    type: "Staking",
    wallet: "DUA Staking Campaign",
  },
  {
    address: "0x6613438c01AF8F22554e6c7Eb6281acED3990839",
    chain: "ETH",
    type: "Staking",
    wallet: "DUA Staking Campaign",
  },
  {
    address: "0x1bc8FC30c499f30e85E37F2AE544DdEEAe52C44c",
    chain: "ETH",
    type: "Staking",
    wallet: "1 Month Staking Campaign",
  },
  {
    address: "0x374300eFFCc6e8cDBCB47dB7D2736628789E9921",
    chain: "ETH",
    type: "Staking",
    wallet: "3 Month Staking Campaign",
  },
  {
    address: "0xe746d677090fDae0813c6B37012827F382f006D0",
    chain: "ETH",
    type: "Staking",
    wallet: "6 Month Staking Campaign",
  },
  {
    address: "0xf29093e35174a8C3c48605F6313Bc4723f7689A2",
    chain: "ETH",
    type: "Staking",
    wallet: "12 Month Staking Campaign",
  },
  {
    address: "0x836b8ebB4E135F82C96aa60F415b4B18D972a4B9",
    chain: "AVAX",
    type: "Fundrs",
    wallet: "Fundrs",
  },
  {
    address: "0xcbA3c4Dc5CA03d67643Cbb817E39B6D2e7d2F963",
    chain: "AVAX",
    type: "Multisig",
    wallet: "Multisig",
  },
  {
    address: "0x0A27A6Ea9d8621423c1AFF1f84d06b4cf2F5f6e7",
    chain: "AVAX",
    type: "IDO",
    wallet: "WeWay",
  },
  {
    address: "0xa583c6725f935c64Fd1ab27303305DF946e9e5b9",
    chain: "AVAX",
    type: "IDO",
    wallet: "Ape",
  },
  {
    address: "0xe95D5A9e3CD46D717939B5B9175e047Fd56910fd",
    chain: "AVAX",
    type: "IDO",
    wallet: "ChainGPT Pad",
  },
  {
    address: "0xbB140F0F582801e88DEdc516691B0950ACDeD5c1",
    chain: "AVAX",
    type: "Staking",
    wallet: "Hypergrowth Activation Staking Campaign",
  },
  {
    address: "0x5e5cDE7c8C79C06D29A2DCEF6f4EE9E248E033cc",
    chain: "AVAX",
    type: "Claim Portal",
    wallet: "Nuklai Claim Portal Locked Tokens",
  },
  {
    address: "0x087CcEF97b666d37a0407739ffF11B9e818E1BAE",
    chain: "AVAX",
    type: "Claim Portal",
    wallet: "Nuklai Claim Portal",
  },
  {
    address: "0x9526c03a87465b11618ad7c2671343e73a2cba92",
    chain: "AVAX",
    type: "Vesting",
    wallet: "Vesting",
  },
  {
    address: "0xe160898fd18ee4075c210703e29925f937d58bf5",
    chain: "AVAX",
    type: "Vesting",
    wallet: "Vesting",
  },
];

async function getTotalSupply() {
  const cachedTotalSupply = cache.get("totalSupply");
  if (cachedTotalSupply !== undefined) {
    return cachedTotalSupply;
  }

  try {
    const url = `https://api.snowtrace.io/api?module=stats&action=tokensupply&contractaddress=${naiContractAddress}&apikey=${apiKey}`;
    const response = await axios.get(url);
    const result = response.data.result;

    if (!isNaN(result)) {
      cache.set("totalSupply", result); // Cache the total supply
      return result;
    } else {
      return cachedTotalSupply;
    }
  } catch (error) {
    console.error("Error fetching total supply:", error);
    throw error;
  }
}

app.get("/", async (req, res) => {
  const cachedBalances = cache.get("balances");
  if (cachedBalances !== undefined) {
    res.send(cachedBalances);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let url = "";
      if (chain === "AVAX") {
        url = `https://api.snowtrace.io/api?module=account&action=tokenbalance&contractaddress=${naiContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      } else if (chain === "ETH") {
        url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${naiContractAddress}&address=${address}&tag=latest&apikey=${apiKeyEth}`;
      }
      const response = await axios.get(url);
      const balance = !isNaN(response?.data?.result)
        ? parseInt(response.data.result)
        : 0;
      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;

    let tableRows = "";

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      const snowtraceLink = `https://snowtrace.io/token/0x9840652DC04fb9db2C43853633f0F62BE6f00f98?a=${address}`;

      tableRows += `<tr>
      <td><a href="${snowtraceLink}" target="_blank">${address}</a></td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens =
      10000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply =
      10000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = ` <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
  
    h1 {
      color: #333;
      font-size: 32px;
      margin-bottom: 20px;
      text-align: center;
    }
  
    p {
      color: #666;
      font-size: 16px;
      margin-bottom: 10px;
    }
  
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      background-color: #fff;
    }
  
    th,
    td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
  
    th {
      background-color: #f9f9f9;
      font-weight: bold;
      font-size: 16px;
    }
  
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
  
    a {
      color: #337ab7;
      text-decoration: underline;
    }
  
    a:hover {
      color: #23527c;
    }
  
    .title-row {
      background-color: #333;
      color: black;
      font-weight: bold;
      font-size: 18px;
    }
  
    .total-supply-row {
      background-color: #f9f9f9;
    }
  
    .empty-row {
      background-color: transparent;
    }
  
    /* Responsive Styles */
    @media screen and (max-width: 600px) {
      h1 {
        font-size: 24px;
      }
  
      p {
        font-size: 14px;
      }
  
      th,
      td {
        padding: 8px;
      }
    }
  </style>
  
  <h1>$NAI Circulating Supply Tracker</h1>
  <p>Total Supply: 10,000,000,000</p>
  <p>Locked & Vesting $NAI: ${burntTokens.toLocaleString()}</p>
  <p>Live Circulating Supply of $NAI: ${totalSupply.toLocaleString()}</p>
  <br><br>
  <table>
    <tr class="title-row">
      <th>Contract Address</th>
      <th>Balance (NAI)</th>
      <th>Chain</th>
      <th>Type</th>
      <th>Name</th>
    </tr>
    ${tableRows}
    <tr class="empty-row">
      <td colspan="5"></td>
    </tr>
    <tr class="total-supply-row">
      <td>$NAI Circulating Supply</td>
      <td>${totalSupply.toLocaleString()}</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </table>

    `;

    cache.set("balances", htmlResponse); // Cache the response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/supply", async (req, res) => {
  const cachedSupply = cache.get("supply");
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
      // Introduce a delay of 250ms (1 second / 4) between each API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      let url = "";
      if (chain === "AVAX") {
        url = `https://api.snowtrace.io/api?module=account&action=tokenbalance&contractaddress=${naiContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      } else if (chain === "ETH") {
        url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${naiContractAddress}&address=${address}&tag=latest&apikey=${apiKeyEth}`;
      }

      const response = await axios.get(url);
      const balance = response?.data?.result
        ? parseInt(response.data.result)
        : 0;

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = "";

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18)}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens =
      10000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply =
      10000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = `${totalSupply}`;

    cache.set("supply", htmlResponse); // Cache the supply response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api", async (req, res) => {
  var queryData = urlParam.parse(req.url, true).query;

  const cachedSupply = cache.get("supply");
  if (cachedSupply !== undefined) {
    if (queryData.result === "json") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ result: cachedSupply }));
    } else {
      res.send(cachedSupply);
    }

    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddressesCMC) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      let url = "";
      if (chain === "AVAX") {
        url = `https://api.snowtrace.io/api?module=account&action=tokenbalance&contractaddress=${naiContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      } else if (chain === "ETH") {
        url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${naiContractAddress}&address=${address}&tag=latest&apikey=${apiKeyEth}`;
      }

      const response = await axios.get(url);
      const balance = response?.data?.result
        ? parseInt(response.data.result)
        : 0;

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = "";

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens =
      10000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply =
      10000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = `${totalSupply}`;

    cache.set("supply", htmlResponse); // Cache the supply response

    if (queryData.result === "json") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ result: htmlResponse }));
    } else {
      res.send(htmlResponse);
    }
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/totalsupply", async (req, res) => {
  const cachedSupply = cache.get("newtotal");
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let url = "";
      if (chain === "AVAX") {
        url = `https://api.snowtrace.io/api?module=account&action=tokenbalance&contractaddress=${naiContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      } else if (chain === "AVAX") {
        url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${naiContractAddress}&address=${address}&tag=latest&apikey=${apiKeyEth}`;
      }
      const response = await axios.get(url);
      const balance = response?.data?.result
        ? parseInt(response.data.result)
        : 0;

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = "";

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18)}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens =
      10000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply =
      10000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;
    const newTotalS = 10000000000 - burntTokens;
    const htmlResponse = `${newTotalS}`;

    cache.set("newtotal", htmlResponse); // Cache the newtotal response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/locked", async (req, res) => {
  const cachedSupply = cache.get("burn");
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let url = "";
      if (chain === "AVAX") {
        url = `https://api.snowtrace.io/api?module=account&action=tokenbalance&contractaddress=${naiContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      } else if (chain === "ETH") {
        url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${naiContractAddress}&address=${address}&tag=latest&apikey=${apiKeyEth}`;
      }

      const response = await axios.get(url);
      const balance = response?.data?.result
        ? parseInt(response.data.result)
        : 0;

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = "";

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens =
      10000000000 - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply =
      10000000000 - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = `${burntTokens.toLocaleString()}`;

    cache.set("burn", htmlResponse); // Cache the burn response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
