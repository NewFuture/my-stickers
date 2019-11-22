/// <reference types="react-scripts" />

declare module "../markdown/*.md";

declare module "javascript-time-ago*";

declare interface Window {
    __PRELOADED_STATE__: any
    snapSaveState: ()=>any;
}