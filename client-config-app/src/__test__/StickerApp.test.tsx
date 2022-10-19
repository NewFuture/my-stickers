import { create } from "react-test-renderer";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { StickerApp } from "../components/StickerApp";
import "../common/i18n";

test("StickerApp Snapshot", () => {
    const tree = create(
        <FluentProvider theme={teamsLightTheme}>
            <StickerApp />
        </FluentProvider>,
    ); // 渲染
    expect(tree).toMatchSnapshot();
});
