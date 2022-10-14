import 'hardhat/types/runtime';

import type { HardhatConfigsProxy } from '.';

declare module 'hardhat/types/runtime' {
    export interface HardhatRuntimeEnvironment {
        configs: HardhatConfigsProxy;
    };
};
