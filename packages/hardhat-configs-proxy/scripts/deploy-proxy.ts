import type { Contract } from 'ethers';

import { configs } from 'hardhat';

/**
 * npx hardhat run scripts/deploy-proxy.ts
 **/

async function main() {
    const contract: Contract = await configs.deployProxy('Value', [ 20 ]);
    console.log(contract.address);
    const alreadyDeployedContract: Contract = await configs.deployProxy('Value', [ 20 ]);
    console.log(alreadyDeployedContract.address);
}

main();
