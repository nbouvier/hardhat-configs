import '@openzeppelin/hardhat-upgrades';

import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { HardhatConfigs } from '@nbouvier/hardhat-configs';
import type { DeployProxyFunction } from './environment/deploy-proxy';
import type { UpgradeProxyFunction } from './environment/upgrade-proxy';

import { subtask, extendEnvironment, extendConfig } from 'hardhat/config';
import { lazyObject } from 'hardhat/plugins';

import './environment/type-extensions';
export { ProxyDeploymentException } from './environment/deploy-proxy';
export { ProxyUpgradeException } from './environment/upgrade-proxy';

export interface HardhatConfigsProxy extends HardhatConfigs {
    deployProxy: DeployProxyFunction,
    upgradeProxy: UpgradeProxyFunction
}

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
    hre.configs = lazyObject((): HardhatConfigsProxy => {
        const { makeGetNetwork, makeDeploy, makeGetContract } = require('@nbouvier/hardhat-configs');
        const { makeDeployProxy } = require('./environment/deploy-proxy');
        const { makeUpgradeProxy } = require('./environment/upgrade-proxy');

        return {
            getNetwork: makeGetNetwork(hre),
            deploy: makeDeploy(hre),
            getContract: makeGetContract(hre),
            deployProxy: makeDeployProxy(hre),
            upgradeProxy: makeUpgradeProxy(hre)
        };
    });
});
