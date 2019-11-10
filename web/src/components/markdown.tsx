import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

import "./markdown.scss";

const fetch = axios.create({
    headers:{
        
    }
}).get;
export interface MarkdownProps {
    file:string
}
export default function Markdown(prop:MarkdownProps) {
    const [source,setSource]= useState('')
    useEffect(()=>{
        fetch(prop.file).then(s=>setSource(s.data))
    })
    return <ReactMarkdown className="markdown"  source={source} />
}