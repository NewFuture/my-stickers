/// <reference types="react-scripts" />
/// <reference path="./locales/i18n.d.ts" />

declare module "../markdown/*.md" {
    const url: string;
    export default url;
}

declare module "javascript-time-ago*";
