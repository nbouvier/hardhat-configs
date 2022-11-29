/**
 * Try to require a package
 * @param {string} pkg - the package to try to require
 * @returns {boolean} a truth value wether the package can be required or not 
 */
 export function tryRequire(pkg: string): boolean {
    try {
        require(pkg);
        return true;
    } catch (e: any) { }

    return false;
}
