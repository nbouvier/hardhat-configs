export interface Config { [ contractName: string ]: ConfigLine };
export interface ConfigLine { artifact: string, address: string };
