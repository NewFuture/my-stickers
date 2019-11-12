import React, { ChangeEvent, useState, useEffect } from "react";
import { Button, List, Header } from "@stardust-ui/react";
import ImageList from "../components/image-list";
import UploadButton from "../components/upload-button";
import { Sticker, getStickers } from "../services/get-stickers";
// import { FormattedMessage } from "react-intl";
import { ConfigPage, NS } from "../locales";
import { init, exit } from "../services/teams";
import { upload, getUploadSAS } from "../services/upload";
import { useTranslation } from "react-i18next";

export default function Config() {
    const [stickes, setStickes] = useState<Sticker[]>([]);
    const { t } = useTranslation(NS.configPage);
    useEffect(() => {
        init()
            .then(getStickers)
            .then(setStickes);
    }, []);

    /**
     * @todo 限制文件大小
     * @param e
     */
    async function ImageUploadHandler(e: ChangeEvent<HTMLInputElement>) {
        const files = [...e.target.files];
        const sasInfos = await getUploadSAS({
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
        <>
            <Header align="center">
                <List
                    items={[
                        <UploadButton onChange={ImageUploadHandler} key="upload" multiple>
                            {t(ConfigPage.upload)}
                        </UploadButton>,
                        <Button
                            icon="trash-can"
                            iconPosition="before"
                            secondary
                            key="delete"
                            content={t(ConfigPage.delete)}
                        />,
                        <Button icon="accept" key="exit" primary iconOnly circular onClick={() => exit()} />,
                    ]}
                    horizontal
                />
            </Header>
            <ImageList items={stickes} />
        </>
    );
}
