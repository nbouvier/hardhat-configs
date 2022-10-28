import type { Contract } from 'ethers';

import { configs } from 'hardhat';

/**
 * npx hardhat run scripts/get-contract.ts
 **/

async function main() {
    await configs.deploy('Value', [ 20 ]);
    const contract: Contract = await configs.getContract('Value');
    console.log(contract.address);
}

main();
