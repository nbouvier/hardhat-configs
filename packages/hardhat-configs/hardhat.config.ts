import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "./dist/index";
import * as dotenv from "dotenv";
dotenv.config();

import "./tasks/call-and-send";
import "./tasks/deploy";
import "./tasks/get-contract";
import "./tasks/get-network";

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    networks: {
        polygonMumbai: {
            url: "https://rpc.ankr.com/polygon_mumbai",
            accounts: [ process.env.PRIVATE_KEY! ],
            chainId: 80001
        }
    },
    etherscan: {
        apiKey: {
            polygonMumbai: process.env.MUMBAISCAN_API_KEY!
        }
    }
};

export default config;
