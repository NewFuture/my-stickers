import App from "./App";
import { create } from "react-test-renderer";
test("Website Snapshot", () => {
    const tree = create(<App />); // 渲染
    expect(tree).toMatchSnapshot();
});
