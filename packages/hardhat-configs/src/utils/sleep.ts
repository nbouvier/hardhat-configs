/**
 * Sleep for <ms> milliseconds
 * @param {number} ms - the number of millisecond to sleep for
 * @returns {Promise<any>} a promise resolving after <ms> milliseconds
 */
export function sleep(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
