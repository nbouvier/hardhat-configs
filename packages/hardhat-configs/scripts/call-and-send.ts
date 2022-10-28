import type { Contract } from 'ethers';

import { configs } from 'hardhat';

/**
 * npx hardhat run scripts/call-and-send.ts
 **/

async function main() {
    const contract: Contract = await configs.deploy('Value', [ 20 ]);
    const value: number = await contract.value();
    console.log(value);
    await contract.updateValue(10);
    const newValue: number = await contract.value();
    console.log(newValue);
}

main();
