import { subtask } from 'hardhat/config';
import { RunSuperFunction } from 'hardhat/types';

import { tryRequire } from '../utils/try-require';


 if (tryRequire('@nomiclabs/hardhat-etherscan')) {
    
    /**
     * hardhat verify <contract-name> [<constructor-args>] [--network <network>]
     */

     subtask('verify:verify')
        .setAction(async ({ address }, { run, configs }, runSuper: RunSuperFunction<any>) => {
            const contract = await configs.getContract(address);
            
            await run('verify:verify', {
                address: contract.address
            });

            console.log(`Verified ${address}`);
        });

}
