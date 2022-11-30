import type { Contract } from 'ethers';

import { task } from 'hardhat/config';

/**
 * npx hardhat deploy
 **/

task('deploy', 'Deploy a contract')
    .setAction(async (_, { configs }) => {
        const contract: Contract = await (await configs.deploy('Value2', [ 20 ], 'Value')).wait();
        console.log(contract.address);
        const alreadyDeployedContract: Contract = await configs.deploy('Value2', [ 20 ], 'Value');
        console.log(alreadyDeployedContract.address);
    });
