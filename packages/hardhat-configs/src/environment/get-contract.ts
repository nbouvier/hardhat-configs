import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { Contract } from 'ethers';
import type { ConfigLine } from '../utils/config';

import { getConfigFile, getContractConfigLine } from '../utils/config';

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
    /**
     * Returns the instance of the <name> contract in the config file or
     *         the <name> instance of the <artifactName> contract loaded from address <address>
     * @param {string} name           - the name of the contract in the config file
     * @param {string} [address]      - the address of the contract (optional)
     * @param {string} [artifactName] - the name of the contract artifact (optional)
     * @returns {Promise<Contract>} a promise resolving to the found contract
     *
     *                    getContract(name: string)
     *                    getContract(name: string, address: string)
     */
    return async function getContract(name: string, address?: string, artifactName?: string): Promise<Contract> {
        // Get the used network
        const network = await hre.configs.getNetwork();
        
        // Load the config line if needed
        let configLine: ConfigLine | null = null;
        if (!artifactName || !address) {
            configLine = await getContractConfigLine(name, network);
        }

        // Evaluate the contract data
        const artifactFile: string = artifactName || configLine?.artifact || name;
        const contractAddress: string | undefined = address || configLine?.address;
        if (!contractAddress) {
            throw new ConfigEntryNotFoundException(name, await getConfigFile());
        }

        // Load the contract
        const contract: Contract = await hre.ethers.getContractAt(artifactFile, contractAddress);

        // Returns the contract
        return contract;
    };
}
