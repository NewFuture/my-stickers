# Azure Function App to process images

## Setups

1. Install Azure Functions Core Tools Run `winget install Microsoft.AzureFunctionsCoreTools` or `npm install -g azure-functions-core-tools@4 --unsafe-perm true`.
2. Install *Azure Storage Explorer* via `winget install Microsoft.AzureStorageExplorer` or [this website](https://azure.microsoft.com/en-us/downloads/).
3. Install [Azurite](vscode:extension/Azurite.azurite) extension for Visual Studio Code. You can find more information about Azurite at [this website](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio-code).
4. (Optional) install *Azure Storage Emulator* via `winget install Microsoft.AzureStorageEmulator` or [this website](https://azure.microsoft.com/en-us/downloads/).
5. Install [Azure Functions](vscode:extension/ms-azuretools.vscode-azurefunctions) extension for Visual Studio Code.
6. (Optional) Install [Azure Storage](vscode:extension/ms-azuretools.vscode-azurestorage) extension for Visual Studio Code.
7. Copy a file named `local.settings.json` from `local.settings.json.template`, and replace `<stickers-blob-connection-string>` with a concrete value. You can retrieve it with *Azure Storage Explorer* or *Azure Storage* extension. Read [this](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-vs-code?tabs=csharp#configure-the-project-to-run-locally) for more information.

## Debug

1. Ensure the appropriate configuration exists in `local.settings.json`.
2. (Note) If you want to test functions with *Azure Storage Emulator*, run *Azure Storage Emulator* and wait for it to be ready to use. In this way, you should copy `local.settings.json` form `local.settings.json.debug`.
3. (Note) If you want to test functions with *Azurite*, run `Azurite: Start` in the command pallette, and select `image-functions` as working directory. In this way, you should copy `local.settings.json` form `local.settings.json.debug`.
4. Press F5 or run `Debug: Start Debugging` in the command pallette, and select `Attach to .NET Functions`.

## Deploy

1. Ensure the appropriate configuration exists in `local.settings.json`.
2. Run `Azure Functions: Deploy to Function App...` in the command pallette, select `image-functions` folder to deploy, and finally select the target resource (`hack-stickers-v2-dev-image-functions` for dev test).
