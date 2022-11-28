import type { Contract } from 'ethers';

import { task } from 'hardhat/config';

/**
 * npx hardhat upgrade-proxy
 **/

task('upgrade-proxy', 'Upgrade a contract')
    .setAction(async (_, { configs }) => {
        const contract: Contract = await configs.deployProxy('Value', [ 20 ]);
        try {
            await contract.getValue();
        } catch (e) {
            console.log('Couldn\'t call getValue() on non upgraded contract.');
        }
        const upgradedContract: Contract = await configs.upgradeProxy('Value', 'ValueUpgraded');
        const value: number = await upgradedContract.getValue();
        console.log(value);
    });
