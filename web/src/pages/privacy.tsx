import React from 'react';
import Markdown from '../components/markdown';

import statement from '../markdown/privacy.md';

export default function PrivacyPage() {
    return <Markdown file={statement} />
}