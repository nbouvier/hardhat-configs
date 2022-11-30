import { subtask } from 'hardhat/config';
import { RunSuperFunction } from 'hardhat/types';

import { tryRequire } from '../utils/try-require';


 if (tryRequire('@nomiclabs/hardhat-etherscan')) {
    
    /**
     * hardhat verify <contract-name> [<constructor-args>] [--network <network>]
     */

     subtask('verify:verify')
        .setAction(async (args: any, { configs }, runSuper: RunSuperFunction<any>) => {
            const contract = await configs.getContract(args.address);
            
            await runSuper({ ...args, address: contract.address });

            console.log(`Verified ${args.address}`);
        });

}
