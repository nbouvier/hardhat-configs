import '@openzeppelin/hardhat-upgrades';

import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { HardhatConfigs } from '@nbouvier/hardhat-configs';
import type { DeployProxyFunction } from './functions/deploy-proxy';
import type { UpgradeProxyFunction } from './functions/upgrade-proxy';

import { subtask, extendEnvironment, extendConfig } from 'hardhat/config';
import { lazyObject } from 'hardhat/plugins';

export interface HardhatConfigsProxy extends HardhatConfigs {
    deployProxy: DeployProxyFunction,
    upgradeProxy: UpgradeProxyFunction
}

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
    hre.configs = lazyObject((): HardhatConfigsProxy => {
        const { makeDeployProxy } = require('./functions/deploy-proxy');
        const { makeUpgradeProxy } = require('./functions/upgrade-proxy');

        return {
            ...hre.configs,
            deployProxy: makeDeployProxy(hre),
            upgradeProxy: makeUpgradeProxy(hre),
        };
    });
});
