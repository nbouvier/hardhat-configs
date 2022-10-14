import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { ContractFactory, Contract } from 'ethers';
import type { ConfigLine } from '@nbouvier/hardhat-configs/types';

import { addToConfig } from '@nbouvier/hardhat-configs/utils/config';
import { getContractConfigLine, getContractFromArtifact } from '@nbouvier/hardhat-configs/utils/contract';
import { ProxyError } from '../errors';

export interface DeployProxyFunction {
    (name: string): Promise<Contract>;
    (name: string, args: any[]): Promise<Contract>;
    (name: string, artifactName: string): Promise<Contract>;
    (name: string, args: any[], artifactName: string): Promise<Contract>;
}

export function makeDeployProxy(hre: HardhatRuntimeEnvironment): DeployProxyFunction {
    // Deploys an upgradeable contract instance of <name> coontract or
    //         an upgradeable contract instance of <artifactName> under <name> in the config file or
    // returns the already deployed contract <name>
    return async function deployProxy(name: string, args: any = [], artifactName?: string): Promise<Contract> {
        // Take the contract from the config file if it has already been deployed
        const configLine: ConfigLine = await getContractConfigLine(name);
        if (configLine) {
            const contractArtifact: string = artifactName || configLine.artifact;
            // Returns the contract
            return await getContractFromArtifact(contractArtifact, configLine.address, hre.ethers.provider);
        }

        // Process parameters in order to support overloading
        if (typeof(args) === 'string') {
            artifactName = args;
            args = [];
        }

        // Deploy the contract
        const contractArtifact: string = artifactName || name;
        var contract: Contract;
        try {
            const factory: ContractFactory = await hre.ethers.getContractFactory(contractArtifact);
            contract = await hre.upgrades.deployProxy(factory, args);
        } catch (e) {
            throw new ProxyError(name);
        }

        // Update the config
        addToConfig(name, contract.address, contractArtifact);

        console.log(`Deployed ${name} to ${contract.address} (proxy)`);
        return contract;
    };
}
