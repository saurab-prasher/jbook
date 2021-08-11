import 'bulmaswatch/superhero/bulmaswatch.min.css';

import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './plugins/code-editor';

const App = () => {
  const [input, setInput] = useState('');
  const iframe = useRef<any>();
  const ref = useRef<any>();
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    iframe.current.srcDoc = html;
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    // setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      

    <div id="root">
    
    </div>

    <script>
    window.addEventListener('message',(event)=>{

      try{
        eval(event.data)
      }
      catch(error){

        const root = document.querySelector('#root')
        root.innerHTML = '<div style="color:red" > <h4>Runtime Error</h4> ' + error +  '</div>'
        console.log(error);

      }
    },false)</script>
    
    </body>
    </html>
  `;

  return (
    <div>
      <CodeEditor
        initialValue="const a = 'apple'"
        onChange={(value) => setInput(value)}
      />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
        title='preview'
      />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
