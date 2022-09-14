import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
if (document) {
  document.createRange = () => ({
      setStart: () => { },
      setEnd: () => { },
      commonAncestorContainer: {
          nodeName: "BODY",
          ownerDocument: document,
      },
  } as any as Range)
}
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
