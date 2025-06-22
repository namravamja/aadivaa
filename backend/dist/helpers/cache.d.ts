export declare const setCache: (key: string, data: any, expiry?: number) => Promise<void>;
export declare const getCache: (key: string) => Promise<any>;
export declare const deleteCache: (key: string) => Promise<void>;
