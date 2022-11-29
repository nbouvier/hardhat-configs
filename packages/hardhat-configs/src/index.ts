import '@nomiclabs/hardhat-ethers';

import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { GetNetworkFunction } from './environment/get-network';
import type { DeployFunction } from './environment/deploy';
import type { GetContractFunction } from './environment/get-contract';

import { extendEnvironment } from 'hardhat/config';
import { lazyObject } from 'hardhat/plugins';

import './environment/type-extensions';
export { NetworkNotFoundException, makeGetNetwork } from './environment/get-network';
export { DeploymentException, makeDeploy } from './environment/deploy';
export { ConfigEntryNotFoundException, makeGetContract } from './environment/get-contract';
export { Config, ConfigLine, getConfigFile, loadConfig, addToConfig, saveConfig, getContractConfigLine } from './utils/config';

export interface HardhatConfigs {
    getNetwork: GetNetworkFunction,
    deploy: DeployFunction,
    getContract: GetContractFunction
}

import './tasks/verify';

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
    hre.configs = lazyObject((): HardhatConfigs => {
        const { makeGetNetwork } = require('./environment/get-network');
        const { makeDeploy } = require('./environment/deploy');
        const { makeGetContract } = require('./environment/get-contract');

        return {
            getNetwork: makeGetNetwork(hre),
            deploy: makeDeploy(hre),
            getContract: makeGetContract(hre)
        };
    });
});
