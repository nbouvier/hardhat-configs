import type { Contract } from 'ethers';

import { task } from 'hardhat/config';

/**
 * npx hardhat get-contract
 **/

task('get-contract', 'Get a contract')
    .setAction(async (_, { configs }) => {
        await configs.deploy('Value', [ 20 ]);
        const contract: Contract = await configs.getContract('Value');
        console.log(contract.address);
    });
