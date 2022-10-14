import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { Contract } from 'ethers';
import type { ConfigLine } from './utils/config';

import { getConfigFile } from './utils/config';
import { getContractConfigLine, getContractFromArtifact } from './utils/contract';

export class ConfigEntryNotFoundException extends Error {
    constructor(contract: string, configFile: string) {
        super(`Couldn't find the ${contract} entry in ${configFile}.`);
        this.name = 'ConfigEntryNotFoundError';
    }
}

export interface GetContractFunction {
    (name: string): Promise<Contract>;
    (name: string, address?: string): Promise<Contract>;
    (name: string, address?: string, artifactName?:string): Promise<Contract>;
}

export function makeGetContract(hre: HardhatRuntimeEnvironment): GetContractFunction {
    // Returns the instance of the <name> contract in the config file or
    //         the <name> instance of the <artifactName> contract loaded from address <address>
    // @arg name         the name of the contract in the config file
    // @arg address      the address of the contract (optional)
    // @arg artifactName the name of the contract artifact (optional)
    return async function getContract(name: string, address?: string, artifactName?: string): Promise<Contract> {
        // Load the config line if needed
        let configLine: ConfigLine | null = null;
        if (!artifactName || !address) {
            configLine = await getContractConfigLine(name);
        }

        // Evaluate the contract data
        const artifactFile: string = artifactName || configLine?.artifact || name;
        const contractAddress: string | undefined = address || configLine?.address;
        if (!contractAddress) {
            throw new ConfigEntryNotFoundException(name, await getConfigFile());
        }

        // Load the contract
        const contract: Contract = await getContractFromArtifact(artifactFile, contractAddress, hre.ethers.provider);

        // Returns the contract
        return contract;
    };
}
