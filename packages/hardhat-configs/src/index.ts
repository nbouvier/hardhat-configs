import '@openzeppelin/hardhat-upgrades';

import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { GetContractFunction } from './functions/get-contract';
import type { DeployFunction } from './functions/deploy';

import { subtask, extendEnvironment, extendConfig } from 'hardhat/config';
import { lazyObject } from 'hardhat/plugins';

export interface HardhatConfigs {
    getContract: GetContractFunction,
    deploy: DeployFunction
}

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
    hre.configs = lazyObject((): HardhatConfigs => {
        const { makeGetContract } = require('./functions/get-contract');
        const { makeDeploy } = require('./functions/deploy');

        return {
            getContract: makeGetContract(hre),
            deploy: makeDeploy(hre)
        };
    });
});
