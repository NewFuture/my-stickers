import ReactMarkdown from "react-markdown";
import type { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
export default function Markdown(opt: ReactMarkdownOptions) {
    return <ReactMarkdown className="markdown" {...opt} />;
}
