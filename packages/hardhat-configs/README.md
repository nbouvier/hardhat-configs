# Hardhat Configs

**Hardhat Configs** provides an easy way to keep track of your deployed contracts address on your favourite blockchain.  
Works also with the `@openzeppelin/hardhat-upgrades` plugin.

## Getting started

### Prerequisites
- Setup your hardhat project
> https://hardhat.org/hardhat-runner/docs/getting-started#quick-start

- Install the peer dependencies.
```
npm install --save-dev ethers
npm install --save-dev @nomiclabs/hardhat-ethers
```

### Installation

1. Install the npm package.
```
npm install --save-dev @nbouvier/hardhat-configs
```

2. Import the package in your `hardhat.config.ts`.
```
// Javascript
require('@nbouvier/hardhat-configs');

// Typescript
import '@nbouvier/hardhat-configs';
```
> **NB:** The import should come after both `@nomiclabs/hardhat-etherscan` and `@openzeppelin/hardhat-upgrades`.

3. Start to write some code !

## Usage

### Configs folder

All of your contracts addresses will be stored in the `./configs` folder under a file named `<network>.config` as a JSON structure. Where network is your network name in your `hardhat.config.ts`.  
  
If the config location does not exist, it will be created.

```
// ./configs/hardhat.config

{
    "ERC20-1": {
        "artifact": "ERC20",
        "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },

    "ERC20-2": {
        "artifact": "ERC20",
        "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    }
}
```

### Deployment

Deploying a contract is made simple be providing the name of your contract to the `deploy` function.  

This name will be the key used in the config file. If the contract has already been deployed before under the same name, an entry will already be registered in the config file and `hardhat-configs` will load this contract for you instead of deploying a new one.

``` 
const { configs } = require("hardhat");
const assert = require("assert");

async function main() {
    // Deploying for the first time
    const myToken = await configs.deploy("ERC20", [ ...<constructor-args> ]);

    // Trying to deploy again under the same name
    const myToken2 = await configs.deploy("ERC20", [ ...<constructor-args> ]);
    
    assert(myToken.address == myToken2.address);
}

main();
```

> **NB:** If you want to deploy your contract under the same name as a previously deployed one, you can still rename it or delete it from the config file.

The name you give to your contract must be the same as your contract's artifact. If it is not, you will need to provide the name of the artifact to use as the last argument.

```
const { configs } = require("hardhat");
const assert = require("assert");

async function main() {
    // Deploying a contract
    const myFirstToken = await configs.deploy("ERC20-1", [ ...<constructor-args> ], "ERC20");

    // Deploying the same contract under a different name
    const mySecondToken = await configs.deploy("ERC20-2", [ ...<constructor-args> ], "ERC20");
    
    assert(myFirstToken.address != mySecondToken.address);
}

main();
```

### Getting a contract

Once you deployed a contract, you can access it anytime using the `getContract` function with the name you gave to your contract as an argument.

```
const { configs } = require("hardhat");

async function main() {
    const myToken = await configs.getContract("ERC20");
}

main();
```

### Getting the network

Sometime, knowing the used network might come handy in order to do specific operation wether you are running on a local, test or main network. Hence, the `getNetwork` function might ease your programming journey.

```
const { configs } = require("hardhat");

async function main() {
    const network = await configs.getNetwork();
}

main();
```

## License
This plugin is released under the [GNU GPL V3 License](License).
