import { HardhatUserConfig, task } from "hardhat/config";

import '@nbouvier/hardhat-configs-proxy';

task('test', 'Test')
    .setAction(async (args: any, { ethers, configs }) => {
        console.log(await configs.getContract('Chuck'));
    });

const config: HardhatUserConfig = {
  solidity: "0.8.9",
};

export default config;
