import 'hardhat/types/runtime';

import type { HardhatConfigs } from '.';

declare module 'hardhat/types/runtime' {
    export interface HardhatRuntimeEnvironment {
        configs: HardhatConfigs;
    };
};
