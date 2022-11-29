import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "./dist/index";
import * as dotenv from "dotenv";
dotenv.config();

import "./tasks/deploy-proxy";
import "./tasks/upgrade-proxy";

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    networks: {
        mumbai: {
            url: "https://rpc.ankr.com/polygon_mumbai",
            accounts: [ process.env.PRIVATE_KEY! ],
            chainId: 80001
        }
    },
    etherscan: {
        apiKey: {
            mumbai: process.env.MUMBAISCAN_API_KEY!
        }
    }
};

export default config;
