import * as microsoftTeams from '@microsoft/teams-js';

export { HostClientType } from '@microsoft/teams-js';

let teamsInitPromise: Promise<void> | undefined;
interface FallbackData {
    getContext: microsoftTeams.Context;
    getAuthToken: string;
    getUserJoinedTeams: microsoftTeams.UserJoinedTeamsInformation;
    /**
     * mock handler trigger
     */
    registerOnThemeChangeHandler: ((handler: (theme: TeamsContextTheme) => void) => void) | TeamsContextTheme;
}
type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
const fallbackData: Partial<FallbackData> = {};

// tricks for typescripts typing tips
export type AnyThemeString = string & { theme?: any };
/**
 * teams theme
 */
export type TeamsContextTheme = 'default' | 'dark' | 'contrast' | AnyThemeString;

export function initTeams(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout((): void => reject(new Error('Timeout')), 10 * 1000);
        microsoftTeams.initialize((): void => {
            clearTimeout(timer);
            resolve();
        });
    });
}

export const SDK_ERROR_NAME = 'TeamsSDKError';
/**
 * warpper teams sdk error
 *
 * @param e
 * @returns
 */
function teamsSDKErrorWarpper(e: any): Promise<never> {
    if (!(e instanceof Error)) {
        e = new Error(e);
    }
    e.name = SDK_ERROR_NAME;
    e.isTeamsSDKError = true;
    return Promise.reject(e);
}
/**
 * patch teams fallback data (merge)
 *
 * @param data
 */
export function patchTeamsFallbackData(data: DeepPartial<FallbackData>): void {
    Object.assign(fallbackData, data);
}

function awaitInitialize<T>(func: () => Promise<T> | T, fallback?: T): Promise<T> {
    if (!teamsInitPromise) {
        teamsInitPromise = initTeams();
    }
    return teamsInitPromise.then(func, fallback === undefined ? teamsSDKErrorWarpper : (): T => fallback);
}

/**
 *
 * @returns TeamsContext async
 */
export function getTeamsContext(): Promise<microsoftTeams.Context> {
    return awaitInitialize(
        () =>
            new Promise(resolve => {
                microsoftTeams.getContext(resolve);
            }),
        fallbackData.getContext
    );
}