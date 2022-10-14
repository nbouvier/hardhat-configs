import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory, Contract } from 'ethers';
import type { ConfigLine } from './utils/config';

import { addToConfig } from './utils/config';
import { getContractConfigLine, getContractFromArtifact } from './utils/contract';

export class DeploymentException extends Error {
    constructor(name: string) {
        super(`Failed to deploy ${name}.`);
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
    // Deploys a contract instance of <name> coontract or
    //         a contract instance of <artifactName> under <name> in the config file or
    // returns the already deployed contract <name>
    // @arg name         the name of the contract in the config file
    // @arg args         the constructor parameters
    // @arg artifactName the name of the contract artifact
    return async function deploy(name: string, args: any[] | string = [], artifactName?: string): Promise<Contract> {
        // Take the contract from the config file if it has already been deployed
        const configLine: ConfigLine = await getContractConfigLine(name);
        if (configLine) {
            const contractArtifact: string = artifactName || configLine.artifact;
            // Returns the contract
            return await getContractFromArtifact(contractArtifact, configLine.address, hre.ethers.provider);
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
            throw new DeploymentException(name);
        }

        // Update the config
        addToConfig(name, contract.address, contractArtifact);

        console.log(`Deployed ${name} to ${contract.address}.`);
        // Returns the new contract
        return contract;
    };
}
