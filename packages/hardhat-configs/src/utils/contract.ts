import type { Artifact } from 'hardhat/types';
import type { Contract } from 'ethers';
import type { JsonRpcProvider } from '@ethersproject/providers';
import type { Config, ConfigLine } from '../types';

import { artifacts } from 'hardhat';
import { ethers } from 'ethers';
import { loadConfig } from './config';

// Returns the config line of a contract
// @arg name the name of the contract in the config file
export async function getContractConfigLine(name: string): Promise<ConfigLine> {
    // Load the network's config
    const config: Config = await loadConfig();
    // Get the config line
    const configLine: ConfigLine = config[name];

    return configLine;
}

// Reads the <artifactName> artifact and returns the contract instance at <address>
// @arg artifactName the name of the contract artifact
// @arg address      the contract address
// @arg Provider     the network provider
export async function getContractFromArtifact(artifactName: string, address: string, provider: JsonRpcProvider): Promise<Contract> {
    // Read the artifact
    const artifact: Artifact = await artifacts.readArtifact(artifactName);
    // Get the contract
    const contract: Contract = new ethers.Contract(address, artifact.abi, provider);

    return contract;
}
