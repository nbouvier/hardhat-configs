import 'hardhat/types/runtime';

// import type { HardhatConfigs } from '.';

declare module 'hardhat/types/runtime' {
    export interface HardhatRuntimeEnvironment {
        // Currently using HardhatConfigs would not allow hardhat-configs-proxy to override configs
        configs: any; // HardhatConfigs;
    }
}
