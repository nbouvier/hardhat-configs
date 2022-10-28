import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory, Contract } from 'ethers';
import type { ConfigLine } from '@nbouvier/hardhat-configs';

import { addToConfig, getNetwork, getContractConfigLine } from '@nbouvier/hardhat-configs';

export class ProxyDeploymentException extends Error {
    constructor(name: string, error: any) {
        super(`Failed to deploy proxy ${name}: ${error.reason}.`);
        this.name = 'ProxyDeploymentException';
    }
}

export interface DeployProxyFunction {
    (name: string): Promise<Contract>;
    (name: string, args: any[]): Promise<Contract>;
    (name: string, artifactName: string): Promise<Contract>;
    (name: string, args: any[], artifactName: string): Promise<Contract>;
}

export function makeDeployProxy(hre: HardhatRuntimeEnvironment): DeployProxyFunction {
    /**
     * Deploys an upgradeable contract instance of <name> coontract or
     *         an upgradeable contract instance of <artifactName> under <name> in the config file or
     * returns the already deployed contract <name>
     * @param {string}       name           - the name of the contract in the config file
     * @param {any[]|string} [args=[]]      - the constructor parameters
     * @param {string}       [artifactName] - the name of the contract artifact
     * @returns {Promis<Contract>} a promise resolving to the deployed or already deployed contract
     *
     *                    deployProxy(name: string)
     *                    deployProxy(name: string, args: any[])
     *                    deployProxy(name: string, artifactName: string)
     */
    return async function deployProxy(name: string, args: any[] | string = [], artifactName?: string): Promise<Contract> {
        // Get the used network
        const network = await hre.configs.getNetwork();

        // Take the contract from the config file if it has already been deployed
        const configLine: ConfigLine = await getContractConfigLine(name, network);
        if (configLine) {
            const contractArtifact: string = artifactName || configLine.artifact;
            // Returns the contract
            return await hre.ethers.getContractAt(contractArtifact, configLine.address);
        }

        // Process parameters in order to support overloading
        if (typeof(args) === 'string') {
            artifactName = args;
            args = [];
        }

        // Deploy the contract
        const contractArtifact: string = artifactName || name;
        var contract: Contract;
        try {
            const factory: ContractFactory = await hre.ethers.getContractFactory(contractArtifact);
            contract = await hre.upgrades.deployProxy(factory, args);
        } catch (e) {
            throw new ProxyDeploymentException(name, e);
        }

        // Update the config
        addToConfig(name, contract.address, contractArtifact, network);

        // Returns the new contract
        console.log(`Deployed ${name} to ${contract.address} (proxy)`);
        return contract;
    };
}
