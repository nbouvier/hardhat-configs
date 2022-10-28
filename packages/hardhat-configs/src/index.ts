import '@nomiclabs/hardhat-ethers';

import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { GetNetworkFunction } from './get-network';
import type { DeployFunction } from './deploy';
import type { GetContractFunction } from './get-contract';

import { subtask, extendEnvironment, extendConfig } from 'hardhat/config';
import { lazyObject } from 'hardhat/plugins';

export { NetworkNotFoundException, makeGetNetwork } from './get-network';
export { DeploymentException, makeDeploy } from './deploy';
export { ConfigEntryNotFoundException, makeGetContract } from './get-contract';
export { Config, ConfigLine, getConfigFile, loadConfig, addToConfig, saveConfig, getContractConfigLine } from './utils/config';

export interface HardhatConfigs {
    getNetwork: GetNetworkFunction,
    deploy: DeployFunction,
    getContract: GetContractFunction
}

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
    hre.configs = lazyObject((): HardhatConfigs => {
        const { makeGetNetwork } = require('./get-network');
        const { makeDeploy } = require('./deploy');
        const { makeGetContract } = require('./get-contract');

        return {
            getNetwork: makeGetNetwork(hre),
            deploy: makeDeploy(hre),
            getContract: makeGetContract(hre)
        };
    });
});
