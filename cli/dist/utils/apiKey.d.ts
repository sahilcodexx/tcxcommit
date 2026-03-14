export declare function saveKey(key: string): void;
export interface ApiKeyOptions {
    forceTrial?: boolean;
}
export declare function getApiKey(options?: ApiKeyOptions): Promise<string>;
