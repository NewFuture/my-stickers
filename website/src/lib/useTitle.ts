import { useEffect } from "react";

export function useTitle(title: string) {
    useEffect(() => {
        const originTitle = document.title;
        document.title = title;
        return () => {
            document.title = originTitle;
        };
    }, [title]);
}
