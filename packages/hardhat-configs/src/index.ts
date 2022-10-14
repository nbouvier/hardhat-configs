import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { GetContractFunction } from './get-contract';
import type { DeployFunction } from './deploy';

import { subtask, extendEnvironment, extendConfig } from 'hardhat/config';
import { lazyObject } from 'hardhat/plugins';

export { DeploymentException } from './deploy';
export { ConfigEntryNotFoundException } from './get-contract';
export { Config, ConfigLine, getConfigFile, loadConfig, addToConfig } from './utils/config';
export { getContractConfigLine, getContractFromArtifact } from './utils/contract';
export { NetworkNotFoundException, getNetwork } from './utils/network';

export interface HardhatConfigs {
    getContract: GetContractFunction,
    deploy: DeployFunction
}

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
    hre.configs = lazyObject((): HardhatConfigs => {
        const { makeGetContract } = require('./get-contract');
        const { makeDeploy } = require('./deploy');

        return {
            getContract: makeGetContract(hre),
            deploy: makeDeploy(hre)
        };
    });
});
