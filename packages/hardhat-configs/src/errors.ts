export class NetworkNotFound extends Error {
    constructor() {
        super(`Couldn't retrieve the used network.`);
        this.name = 'NetworkNotFound';
    }
}

export class ConfigEntryNotFoundError extends Error {
    constructor(contract: string, configFile: string) {
        super(`Couldn't find the ${contract} entry in ${configFile}.`);
        this.name = 'ConfigEntryNotFoundError';
    }
}

export class DeploymentError extends Error {
    constructor(name: string) {
        super(`Failed to deploy ${name}.`);
        this.name = 'DeploymentError';
    }
}
