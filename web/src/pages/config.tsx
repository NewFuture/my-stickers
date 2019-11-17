import React from "react";
import { Button, List, Header } from "@stardust-ui/react";
import ImageList from "../components/list/";
import UploadButton from "../components/upload-button";
import { NS, ConfigPage } from "../locales";
import { exit } from "../services/teams";
import { useTranslation } from "react-i18next";
import LanguageButton from "../components/language";
// import { createStore } from "redux";
import { Provider } from "react-redux";
// import reducer from "../reducer";
import { store } from "../store";
// const store = createStore<>(reducer);

export default function Config() {
    // const [stickes, setStickes] = useState<Sticker[]>([]);
    const { t } = useTranslation(NS.configPage);
    // useEffect(() => {
    //     init().then(getStickers)
    // }, []);

    /**
     * @todo 限制文件大小
     * @param e
     */
    // async function ImageUploadHandler(e: ChangeEvent<HTMLInputElement>) {
    //     const files = [...e.target.files];
    //     const sasInfos = await getUploadSAS({
    //         exts: files.map(f => f.name.split(".").pop()!),
    //     });
    //     const newFiles = files.map(
    //         (f, index) =>
    //             ({
    //                 src: URL.createObjectURL(f),
    //                 name: f.name.replace(/\..*$/, ""),
    //                 id: sasInfos[index].id,
    //                 status: "pending",
    //                 file: f,
    //             } as Sticker & { file: File }),
    //     );
    //     // setStickes([...newFiles, ...stickes]);

    //     newFiles.forEach((f, index) => upload(f.file, sasInfos[index]));
    // }
    return (
        <Provider store={store}>
            <LanguageButton />
            <Header>
                <List
                    items={[
                        <Button icon="accept" key="exit" primary iconOnly circular onClick={() => exit()} />,
                        <UploadButton key="upload" multiple>
                            {t(ConfigPage.upload)}
                        </UploadButton>,
                        <Button
                            icon="trash-can"
                            iconPosition="before"
                            secondary
                            key="delete"
                            content={t(ConfigPage.delete)}
                        />,
                    ]}
                    horizontal
                />
            </Header>
            <ImageList />
        </Provider>
    );
}
