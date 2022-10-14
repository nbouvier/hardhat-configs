import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory, Contract } from 'ethers';

import { getContractConfigLine, getContractFromArtifact } from '@nbouvier/hardhat-configs';

export class ProxyUpgradeException extends Error {
    constructor(name: string) {
        super(`Failed to upgrade proxy ${name}.`);
        this.name = 'ProxyUpgradeException';
    }
}

export interface UpgradeProxyFunction {
    (name: string, artifactName: string): Promise<Contract>;
}

export function makeUpgradeProxy(hre: HardhatRuntimeEnvironment): UpgradeProxyFunction {
    // Upgrades the <name> contract to the <artifactName> logic implementation
    // @arg name         the name of the contract in the config file
    // @arg artifactName the name of the contract artifact
    return async function upgradeProxy(name: string, artifactName: string): Promise<Contract> {
        // Get the contract
        const contract: Contract = await hre.configs.getContract(name);

        // Upgrade the contract
        var newContract: Contract;
        try {
            const factory: ContractFactory = await hre.ethers.getContractFactory(artifactName);
            newContract = await hre.upgrades.upgradeProxy(contract.address, factory);
        } catch (e) {
            throw new ProxyUpgradeException(name);
        }

        // Return the upgraded contract
        console.log(`Upgraded ${name}`);
        return newContract;
    };
}
