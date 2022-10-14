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
// @arg contract the contract to get the artifact of
// @arg address  the contract address
// @arg Provider the network provider
export async function getContractFromArtifact(contract: string, address: string, provider: JsonRpcProvider): Promise<Contract> {
    // Read the ABI
    const abi: Interface = getContractABI(contract);
    // Get the contract
    const contract: Contract = new ethers.Contract(address, abi, provider);

    return contract;
}

// Returns the contract artifact file name
// @arg contract the contract to get the artifact name of
// @returns string the name of the contract artifact
function getArtifactName(contract: string): string {
    return `${ARTIFACT_FOLDER}${contract}${ARTIFACT_FOLDER_EXT}${contract}${ARTIFACT_EXT}`;
}

// Returns the contract ABI
// @arg contract the contract to get the ABI of
// @returns the ABI of the contract
function getContractABI(contract: string): Promise<Interface> {
    const artifactName: string = getArtifactName(contract);
    const artifact: any = JSON.parse(fs.readFileSync(artifactName, { encoding: 'utf8', flag:'r' }));
    const abi: Interface = new ethers.utils.Interface(artifact.abi);

    return abi;
}
