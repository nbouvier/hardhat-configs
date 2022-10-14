import '@openzeppelin/hardhat-upgrades';

import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { HardhatConfigs } from '@nbouvier/hardhat-configs';
import type { DeployProxyFunction } from './deploy-proxy';
import type { UpgradeProxyFunction } from './upgrade-proxy';

import { subtask, extendEnvironment, extendConfig } from 'hardhat/config';
import { lazyObject } from 'hardhat/plugins';

export { ProxyDeploymentException } from './deploy-proxy';
export { ProxyUpgradeException } from './upgrade-proxy';

export interface HardhatConfigsProxy extends HardhatConfigs {
    deployProxy: DeployProxyFunction,
    upgradeProxy: UpgradeProxyFunction
}

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
    hre.configs = lazyObject((): HardhatConfigsProxy => {
        const { makeDeployProxy } = require('./deploy-proxy');
        const { makeUpgradeProxy } = require('./upgrade-proxy');

        return {
            ...hre.configs,
            deployProxy: makeDeployProxy(hre),
            upgradeProxy: makeUpgradeProxy(hre),
        };
    });
});
