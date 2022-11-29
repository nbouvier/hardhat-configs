import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "./dist/index";

import "./tasks/calll-and-send";
import "./tasks/deploy";
import "./tasks/get-contract";
import "./tasks/get-network";

const config: HardhatUserConfig = {
    solidity: "0.8.9",
};

export default config;
