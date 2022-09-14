import ReactMarkdown from "react-markdown";
import type { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import "./markdown.scss";
export default function Markdown(opt: ReactMarkdownOptions) {
    return <ReactMarkdown className="markdown" {...opt} />;
}
