import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "./src/index";

const config: HardhatUserConfig = {
    solidity: "0.8.9",
};

export default config;
