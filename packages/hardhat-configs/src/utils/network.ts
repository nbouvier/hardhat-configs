import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { Contract } from 'ethers';

import { sleep } from './sleep';

export class NetworkNotFoundException extends Error {
    constructor() {
        super(`Couldn't retrieve the used network.`);
        this.name = 'NetworkNotFound';
    }
}

// Returns the used network as a string. Tries <maxRep> times with a delay of
// <delay> until a network is found.
// @arg rep the maximum number of tries. -1 for unlimited tries.
// @arg delay  the delay in ms between each try.
export async function getNetwork(rep: number = 5, delay: number = 1000): Promise<string> {
    const hre = require('hardhat');

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
    return getNetwork(rep-1, delay);
}
