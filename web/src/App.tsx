import React, { ChangeEvent, useState } from "react";
import { Button, List } from "@stardust-ui/react";
import "./App.css";
import ImageList from "./components/image-list";
import UploadButton from "./components/upload-button";
import { Sticker, getStickers } from "./services/get-stickers";
import { FormattedMessage } from "react-intl";
import { Messages } from "./locales";
import { init, exit, getUserId } from "./services/teams";
import { upload, getUploadSAS } from "./services/upload";

const App: React.FC = () => {
    const [stickes, setStickes] = useState<Sticker[]>(getStickers());

    init();
    const token = "";
    const user = getUserId();
    /**
     * @todo 限制文件大小
     * @param e
     */
    async function ImageUploadHandler(e: ChangeEvent<HTMLInputElement>) {
        const files = [...e.target.files];
        const sasInfos = await getUploadSAS({
            user: await user,
            token,
            exts: files.map(f => f.name.split(".").pop()!),
        });
        const newFiles = files.map(
            (f, index) =>
                ({
                    src: URL.createObjectURL(f),
                    name: f.name.replace(/\..*$/, ""),
                    id: sasInfos[index].id,
                    status: "pending",
                    file: f,
                } as Sticker & { file: File }),
        );
        setStickes([...newFiles, ...stickes]);

        newFiles.forEach((f, index) => upload(f.file, sasInfos[index]));
    }
    return (
        <div className="App">
            <header className="App-header">
                <List
                    items={[
                        <UploadButton onChange={ImageUploadHandler} key="upload" multiple />,
                        <Button
                            icon="trash-can"
                            iconPosition="before"
                            secondary
                            key="delete"
                            content={<FormattedMessage id={Messages.delete} />}
                        />,
                        <Button icon="accept" primary iconOnly circular onClick={() => exit()} />,
                    ]}
                    horizontal
                />
                <ImageList items={stickes} />
            </header>
        </div>
    );
};

export default App;
