# Custom Stickers for Microsoft Teams

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=v2&repo=NewFuture/custom-stickers-teams-extension&devcontainer_path=.devcontainer%2Fdevcontainer.json)

## [/client-config-app](./client-config-app/)

The Web App in Teams for Management Stickers and uploading.

The deploy path is `/config/`.
The build files will put to the `/config/` folder of the website.

Main Dependencies and Technology:

-   `@fluentui/react-components`: FluentUI V9
-   `react@18` and `typescript` to build the app
-   `i18next`: for localization
-   `@microsoft/teams-js@v2`: for Teams API
-   `swr`: lightweight hooks for query and cache (like react query)

## [/website](./website/)

The Public Static Web Sites for prototypes and Statements.

The deploy path is `/`.
The build files will put to the root folder of the website.

Main Dependencies and Technology:

-   ~~`@stardust-ui/react`~~ (old name of `@fluentui/react-northstar`): for teams chat prototype components
-   `react@18` and `typescript` to build the app
-   `i18next`: for localization
-   `react-router-dom`: for routing
-   `react-markdown`: render markdown files
-   `react-snap`: pre-render websites

## [server](./server)

[![Build Status](https://dev.azure.com/NewFuture-CI/CI/_apis/build/status/custom-stickers.server-api?branchName=master)](https://dev.azure.com/NewFuture-CI/CI/_build/latest?definitionId=5&branchName=master)

Sever API and bot

## [/manifest](./manifest)

Manifest Package files

-   Search and Query
-   ActionButton in Compose Extension
-   allow admin customization `configurableProperties`

Dependencies:

-   `package-teams-app`: package the manifest.zip (auto replace environment vars and validate schemas)

## [/official-stickers](./official-stickers)

Manage the Official Recommened Stickers
