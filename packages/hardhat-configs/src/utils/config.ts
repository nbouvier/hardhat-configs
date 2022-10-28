import type { HardhatRuntimeEnvironment } from 'hardhat/types';

import fs from 'fs';

export interface Config { [ contractName: string ]: ConfigLine };
export interface ConfigLine { artifact: string, address: string };

const CONFIG_FOLDER = './configs/';
const CONFIG_EXT = '.config';

/**
 * Returns the config file name of the used network
 * @param {string} [network] - used network
 * @returns {Promise<string>} a promise resolving to the config file name
 *
 *              getConfigFile(): string;
 */
export async function getConfigFile(network?: string): Promise<string> {
    // Get the network if needed
    if (!network) {
        const { configs } = require('hardhat');
        network = await configs.getNetwork();
    }

    // Build the config file path
    return `${CONFIG_FOLDER}${network}${CONFIG_EXT}`;
}

/**
 * Loads the config from <configFile>
 * @param {string} [network] - network to load the config file for
 * @returns {Promise<Config>}  a promise resolving to the loaded config
 *
 *                    loadConfig(): Promise<Config>;
 */
export async function loadConfig(network?: string): Promise<Config> {
    // Get the network's config file
    const configFile = await getConfigFile(network);

    // Returns an empty config if the config file does not exist
    if (!fs.existsSync(configFile)) {
        return {};
    }

    // Returns the fetched config from the config file
    return JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8', flag:'r' }));
}

/**
 * Add the given contract informations to the config file of the used network
 * @param {string} name       - the name of the contract in the config file
 * @param {string} address    - the address of the contract
 * @param {string} [artifact] - the name of the contract artifact
 * @param {string} [network]  - the network to use the config file from
 * @returns {Promise<Config>}  a promise resolving to the new config
 *
 *                    addToConfig(name: string, address: string): Promise<Config>;
 *                    addToConfig(name: string, address: string, artifactName: string): Promise<Config>;
 */
export async function addToConfig(name: string, address: string, artifactName?: string, network?: string): Promise<Config> {
    // Load the network's config
    const config: Config = await loadConfig(network);

    // Build the new config
    const newConfig: Config = {
        ...config,
        [name]: {
            artifact: artifactName || name,
            address: address
        }
    };

    // Save the new config
    await saveConfig(newConfig, network);

    return newConfig;
}

/**
 * Save a config
 * @param {Config} config    - the config to save
 * @param {string} [network] - the network to save the config for
 *
 *                    saveConfig(config: Config);
 */
export async function saveConfig(config: Config, network?: string) {
    // Get the network's config file
    const configFile = await getConfigFile(network);

    // Write the new config
    const parsedConfig: string = JSON.stringify(config, null, 4);
    fs.writeFileSync(configFile, parsedConfig, 'utf-8');
}

/**
 * Returns the config line of a contract
 * @param {string} name      - the name of the contract in the config file
 * @param {string} [network] - the network to use the config file from
 * @returns {Promise<ConfigLine>} a promise resolving to the contract config line
 *
 *                    getContractConfigLine(name: string)
 */
export async function getContractConfigLine(name: string, network?: string): Promise<ConfigLine> {
    // Load the network's config
    const config: Config = await loadConfig(network);
    // Get the config line
    const configLine: ConfigLine = config[name];

    return configLine;
}
