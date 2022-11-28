import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "./dist/index";

import "./tasks/deploy-proxy";
import "./tasks/upgrade-proxy";

const config: HardhatUserConfig = {
    solidity: "0.8.9",
};

export default config;
