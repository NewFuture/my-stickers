import React, { useEffect, useRef, useState } from "react";
import { Button, Image, mergeClasses, Spinner, Text } from "@fluentui/react-components";
import { Sticker, StickerStatus } from "../../model/sticker";
import { DeleteRegular } from "@fluentui/react-icons";
import { useUploadItemStyles } from "./UploadImageItem.styles";

interface UploadImageItemProps {
    file: File;
    onFinish: (file: File, sticker?: Sticker) => void;
    onUpload: (file: File, onProgressUpdate: (percent: number) => void) => Promise<any>;
    className?: string;
}

function getStickerDataFromBlob(file: File) {
    return {
        src: URL.createObjectURL(file),
        name: file.name.replace(/\..*$/, ""),
    };
}

export const UploadImageItem: React.FC<UploadImageItemProps> = ({
    file,
    onFinish,
    onUpload,
    className,
}: UploadImageItemProps): JSX.Element => {
    const styles = useUploadItemStyles();
    const [sticker, setSticker] = useState<Sticker>(() => getStickerDataFromBlob(file) as Sticker);
    const [errMsg, setErrMsg] = useState<string>();

    const actionsRef = useRef({ onFinish, onUpload });
    actionsRef.current.onFinish = onFinish;
    actionsRef.current.onUpload = onUpload;

    useEffect((): void => {
        actionsRef.current
            .onUpload(file, (progress) => setSticker((s) => ({ ...s, progress })))
            .then(
                (data) => {
                    actionsRef.current.onFinish(file, {
                        ...data,
                        ...getStickerDataFromBlob(file),
                        status: StickerStatus.success,
                    });
                },
                (err) => {
                    setErrMsg(err + "");
                    setSticker((s) => ({ ...s, status: StickerStatus.upload_fail, progress: undefined }));
                },
            );
    }, [file]);

    const isFailed = sticker.status === StickerStatus.upload_fail;
    return (
        <div className={mergeClasses(styles.root, className)}>
            <Image className={styles.img} src={sticker.src} />
            <Text className={styles.name} size={500}>
                {sticker.name}
            </Text>
            <div className={styles.overlay}>
                {isFailed ? (
                    <>
                        <Button
                            className={styles.error}
                            icon={<DeleteRegular />}
                            size="large"
                            appearance="transparent"
                            onClick={() => actionsRef.current.onFinish(file)}
                        />
                        <Text className={styles.error} size={600} truncate>
                            {errMsg}
                        </Text>
                    </>
                ) : sticker.progress ? (
                    <>
                        <Text className={styles.progressText} size={600}>
                            {sticker.progress + "%"}
                        </Text>
                        <progress className={styles.progress} value={sticker.progress} max="100" />
                    </>
                ) : (
                    <Spinner size="large" />
                )}
            </div>
        </div>
    );
};
