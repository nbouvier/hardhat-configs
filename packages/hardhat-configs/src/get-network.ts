import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { Contract } from 'ethers';

import { sleep } from './utils/sleep';

export class NetworkNotFoundException extends Error {
    constructor() {
        super(`Couldn't retrieve the used network.`);
        this.name = 'NetworkNotFound';
    }
}

export interface GetNetworkFunction {
    (): Promise<string>;
    (rep?: number): Promise<string>;
    (rep?: number, delay?: number): Promise<string>;
}

export function makeGetNetwork(hre: HardhatRuntimeEnvironment): GetNetworkFunction {
    /**
     * Returns the used network as a string. Tries <maxRep> times with a delay of
     * <delay> until a network is found.
     * @param {number} rep   - the maximum number of tries. -1 for unlimited tries.
     * @param {number} delay - the delay in ms between each try.
     * @returns {Promise<string>} a promise resolving to the network name
     *
     *                    getNetwork()
     *                    getNetwork(rep: number)
     */
    return async function getNetwork(rep: number = 5, delay: number = 1000): Promise<string> {
        // Return the network name if found
        if (hre.network.name) {
            return hre.network.name;
        }

        // Throw an exception if every repetition has been done
        if (!rep) {
            throw new NetworkNotFoundException();
        }

        // Print the waiting message in the console
        const strDelay = `${delay/1000}s`;
        const strRep = rep > 0 ? ` (${rep})` : '';
        console.log(`Couldn't find network ... Retrying in ${strDelay}${strRep}`);

        // Wait <delay> ms
        await sleep(delay);

        // Repeat
        return hre.configs.getNetwork(rep-1, delay);
    };
}
