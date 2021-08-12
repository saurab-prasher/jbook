import { useRef, useEffect } from 'react';
interface PreviewProps {
  code: string;
}

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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcDoc = html;
    iframe.current.contentWindow.postMessage(code, '*');
  }, [code]);
  return (
    <iframe
      ref={iframe}
      sandbox='allow-scripts'
      srcDoc={html}
      title='preview'
    />
  );
};

export default Preview;
