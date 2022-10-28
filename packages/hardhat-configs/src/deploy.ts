import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory, Contract } from 'ethers';
import type { ConfigLine } from './utils/config';

import { addToConfig, getContractConfigLine } from './utils/config';

export class DeploymentException extends Error {
    constructor(name: string, error: any) {
      console.log(Object.keys(error))
        super(`Failed to deploy ${name}: ${error.reason}`);
        this.name = 'DeploymentError';
    }
}

export interface DeployFunction {
    (name: string): Promise<Contract>;
    (name: string, args: any[]): Promise<Contract>;
    (name: string, artifactName: string): Promise<Contract>;
    (name: string, args: any[], artifactName: string): Promise<Contract>;
}

export function makeDeploy(hre: HardhatRuntimeEnvironment): DeployFunction {
    /**
     * Deploys a contract instance of <name> coontract or
     *         a contract instance of <artifactName> under <name> in the config file or
     * returns the already deployed contract <name>
     * @param {string}       name           - the name of the contract in the config file
     * @param {any[]|string} [args=[]]      - the constructor parameters
     * @param {string}       [artifactName] - the name of the contract artifact
     * @returns {Promis<Contract>} a promise resolving to the deployed or already deployed contract
     *
     *                    deploy(name: string)
     *                    deploy(name: string, args: any[])
     *                    deploy(name: string, artifactName: string)
     */
    return async function deploy(name: string, args: any[] | string = [], artifactName?: string): Promise<Contract> {
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
            contract = await factory.deploy(...args);
        } catch (e) {
            throw new DeploymentException(name, e);
        }

        // Update the config
        addToConfig(name, contract.address, contractArtifact, network);

        // Returns the new contract
        console.log(`Deployed ${name} to ${contract.address}.`);
        return contract;
    };
}
