export default class Url implements IService {
    effectiveUrlProvider: ((url: string, trigger: JQuery) => string);
    onAuthenticationFailed: (() => void);
    makeAbsolute(baseUrl: string, relativeUrl: string): string;
    makeRelative(url: string): string;
    isAbsolute(url: string): boolean;
    current(): string;
    goBack(): void;
    updateQuery(uri: any, key: any, value: any): any;
    removeQuery(url: string, parameter: string): string;
    getQuery(name: string, url?: string): string;
    getModalQuery(name: string): string;
    goToUrlAfterLogin(url: string): void;
    private goToLoginPage;
    private fullQueryString;
    addQuery(url: string, key: string, value: any): string;
    removeEmptyQueries(url: string): string;
    baseContentUrl: any;
    ofContent(relativeUrl: string): string;
}
