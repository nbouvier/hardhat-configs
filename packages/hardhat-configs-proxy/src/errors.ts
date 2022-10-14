export class ProxyError extends Error {
    constructor(name: string, isUpgrade: boolean = false) {
        const strAction = isUpgrade ? 'upgrade' : 'deploy';
        super(`Failed to ${strAction} proxy ${name}.`);
        this.name = 'ProxyError';
    }
}
