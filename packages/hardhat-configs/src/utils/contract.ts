import type { Contract } from 'ethers';
import type { Interface } from '@ethersproject/abi';
import type { JsonRpcProvider } from '@ethersproject/providers';
import type { Config, ConfigLine } from './config';

import fs from 'fs';
import { ethers } from 'ethers';
import { loadConfig } from './config';

const ARTIFACT_FOLDER: string = './artifacts/contracts/';
const ARTIFACT_FOLDER_EXT: string = '.sol/';
const ARTIFACT_EXT: string = '.json';

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
// @arg contractName the contract to get the artifact of
// @arg address      the contract address
// @arg Provider     the network provider
export async function getContractFromArtifact(contractName: string, address: string, provider: JsonRpcProvider): Promise<Contract> {
    // Read the ABI
    const abi: Interface = getContractABI(contractName);
    // Get the contract
    const contract: Contract = new ethers.Contract(address, abi, provider);

    return contract;
}

// Returns the contract artifact file name
// @arg contractName the contract to get the artifact name of
// @returns string the name of the contract artifact
function getArtifactName(contractName: string): string {
    return `${ARTIFACT_FOLDER}${contractName}${ARTIFACT_FOLDER_EXT}${contractName}${ARTIFACT_EXT}`;
}

// Returns the contract ABI
// @arg contractName the contract to get the ABI of
// @returns the ABI of the contract
function getContractABI(contractName: string): Interface {
    const artifactName: string = getArtifactName(contractName);
    const artifact: any = JSON.parse(fs.readFileSync(artifactName, { encoding: 'utf8', flag:'r' }));
    const abi: Interface = new ethers.utils.Interface(artifact.abi);

    return abi;
}
