import type { Contract } from 'ethers';

import { task } from 'hardhat/config';

/**
 * npx hardhat deploy-proxy
 **/

task('deploy-proxy', 'Deploy a contract behind a proxy')
    .setAction(async (_, { configs }) => {
        const contract: Contract = await configs.deployProxy('Value', [ 20 ]);
        console.log(contract.address);
        const alreadyDeployedContract: Contract = await configs.deployProxy('Value', [ 20 ]);
        console.log(alreadyDeployedContract.address);
    });
