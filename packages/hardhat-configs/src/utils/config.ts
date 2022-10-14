import type { HardhatRuntimeEnvironment } from 'hardhat/types';

import fs from 'fs';
import { getNetwork } from './network';

export interface Config { [ contractName: string ]: ConfigLine };
export interface ConfigLine { artifact: string, address: string };

const CONFIG_FOLDER = './configs/';
const CONFIG_EXT = '.config';

// Returns the config file name of the used network
// @returns {string} the config file name
export async function getConfigFile(): Promise<string> {
    // Get the used network
    const network: string = await getNetwork();

    // Build the config file path
    return `${CONFIG_FOLDER}${network}${CONFIG_EXT}`;
}

// Loads the config from <configFile>
// @param {string} config file to load
// @returns {Config} the loaded config
//             loadConfig(): Promise<Config>;
export async function loadConfig(configFile?: string): Promise<Config> {
    // Get the network's config file if needed
    if (!configFile) {
        configFile = await getConfigFile();
    }

    // Returns an empty config if the config file does not exist
    if (!fs.existsSync(configFile)) {
        return {};
    }

    // Returns the fetched config from the config file
    return JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8', flag:'r' }));
}

// Add the given contract informations to the config file of the used network
// @arg name     the name of the contract in the config file
// @arg address  the address of the contract
// @arg artifact the name of the contract artifact (optional)
//                    addToConfig(name: string, address: string): Promise<Config>;
export async function addToConfig(name: string, address: string, artifactName?: string): Promise<Config> {
    // Load the network's config
    const configFile: string = await getConfigFile();
    const config: Config = await loadConfig(configFile);

    // Build the new config
    const newConfig: Config = {
        ...config,
        [name]: {
            artifact: artifactName || name,
            address: address
        }
    };

    // Save the new config
    const parsedNewConfig: string = JSON.stringify(newConfig, null, 4);
    fs.writeFileSync(configFile, parsedNewConfig, 'utf-8');

    return newConfig;
}
