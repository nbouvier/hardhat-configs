import '@openzeppelin/hardhat-upgrades';

import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { HardhatConfigs } from '@nbouvier/hardhat-configs';
import type { DeployProxyFunction } from './deploy-proxy';
import type { UpgradeProxyFunction } from './upgrade-proxy';

import { subtask, extendEnvironment, extendConfig } from 'hardhat/config';
import { lazyObject } from 'hardhat/plugins';

import './type-extensions';
export { ProxyDeploymentException } from './deploy-proxy';
export { ProxyUpgradeException } from './upgrade-proxy';

export interface HardhatConfigsProxy extends HardhatConfigs {
    deployProxy: DeployProxyFunction,
    upgradeProxy: UpgradeProxyFunction
}

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
    hre.configs = lazyObject((): HardhatConfigsProxy => {
        const { makeGetNetwork, makeDeploy, makeGetContract } = require('@nbouvier/hardhat-configs');
        const { makeDeployProxy } = require('./deploy-proxy');
        const { makeUpgradeProxy } = require('./upgrade-proxy');

        return {
            getNetwork: makeGetNetwork(hre),
            deploy: makeDeploy(hre),
            getContract: makeGetContract(hre),
            deployProxy: makeDeployProxy(hre),
            upgradeProxy: makeUpgradeProxy(hre)
        };
    });
});
