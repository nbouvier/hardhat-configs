import type { Contract } from 'ethers';

import { task } from 'hardhat/config';

/**
 * npx hardhat call-and-send
 **/

task('call-and-send', 'Make a function call and a transaction')
    .setAction(async (_, { configs }) => {
        const contract: Contract = await configs.deploy('Value', [ 20 ]);
        const value: number = await contract.value();
        console.log(value);
        await (await contract.updateValue(10)).wait();
        const newValue: number = await contract.value();
        console.log(newValue);
    });
