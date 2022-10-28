import type { Contract } from 'ethers';

import { configs } from 'hardhat';

/**
 * npx hardhat run scripts/deploy.ts
 **/

async function main() {
    const contract: Contract = await configs.deploy('Value', [ 20 ]);
    console.log(contract.address);
    const alreadyDeployedContract: Contract = await configs.deploy('Value', [ 20 ]);
    console.log(alreadyDeployedContract.address);
}

main();
