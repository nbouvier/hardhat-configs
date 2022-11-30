import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory, Contract } from 'ethers';

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
    /**
     * Upgrades the <name> contract to the <name> logic implementation or
     *                              to the <artifactName> logic implementation
     * @param {string} name           - the name of the contract in the config file
     * @param {string} [artifactName] - the name of the contract artifact
     * @returns {Promise<Contract>} a promise resolving to the upgraded contract
     * 
     *                    upgradeProxy(name: string)
     */
    return async function upgradeProxy(name: string, artifactName?: string): Promise<Contract> {
        // Setting artifactName if needed
        artifactName = artifactName || name;

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
