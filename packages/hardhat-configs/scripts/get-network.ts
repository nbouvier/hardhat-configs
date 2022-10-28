import type { Contract } from 'ethers';

import { configs } from 'hardhat';

/**
 * npx hardhat run scripts/get-network.ts
 **/

async function main() {
    const network: string = await configs.getNetwork();
    console.log(network);
}

main();
