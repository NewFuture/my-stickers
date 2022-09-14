import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

import "./markdown.scss";

const fetch = axios.create({
    headers: {},
}).get;
export interface MarkdownProps {
    file: string;
}

export default function Markdown({ file }: MarkdownProps) {
    const [source, setSource] = useState("");
    useEffect(() => {
        fetch(file).then((s) => setSource(s.data));
    }, [file]);
    return <ReactMarkdown className="markdown">{source}</ReactMarkdown>;
}
