import { task } from 'hardhat/config';

/**
 * npx hardhat get-network
 **/

task('get-network', 'Get the network')
    .setAction(async (_, { configs }) => {
        const network: string = await configs.getNetwork();
        console.log(network);
    });
