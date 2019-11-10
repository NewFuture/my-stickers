import React from 'react';
import Markdown from '../components/markdown';

import statement from '../markdown/terms.md';


export default function TermsPage() {
    return <Markdown file={statement} />
}