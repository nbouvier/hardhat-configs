import type { Contract } from 'ethers';

import { task } from 'hardhat/config';

/**
 * npx hardhat deploy
 **/

task('deploy', 'Deploy a contract')
    .setAction(async (_, { configs }) => {
        const contract: Contract = await configs.deploy('Value', [ 20 ]);
        console.log(contract.address);
        const alreadyDeployedContract: Contract = await configs.deploy('Value', [ 20 ]);
        console.log(alreadyDeployedContract.address);
    });
