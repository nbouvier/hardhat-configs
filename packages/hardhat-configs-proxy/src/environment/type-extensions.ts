import 'hardhat/types/runtime';

// import type { HardhatConfigsProxy } from '.';

declare module 'hardhat/types/runtime' {
    export interface HardhatRuntimeEnvironment {
        // Currently using HardhatConfigsProxy is not permitted by typescript
        configs: any; // HardhatConfigsProxy; 
    }
}
