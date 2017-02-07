import Document, { Head, Main, NextScript } from 'next/document'

export default class CBDocument extends Document {
  static async getInitialProps (ctx) {
    const props = await Document.getInitialProps(ctx)
    return { ...props }
  }

  render () {
    return (
     <html>
       <Head>
         <style>
           {`
             * {
               box-sizing: border-box;
             }

             body {
               font-family: Baskerville W01 Regular_705699;
               color:white;
               background-color: #1a1a1a;
               margin: 0;
               font-size: 16px;
               line-height: 1.2em;
               text-shadow: #162931 2px 2px 0;
             }

             h1, h2 {
               font-family: Avenir Next LT W01 Bold;
               margin: 0.5em 0;
               font-size: 1.5em;
               line-height: 1.2em;
             }

             a {
               color:inherit;
               text-decoration:inherit;
             }

             @media (min-width: 800px){
               body {
                 font-size: 2vw;
               }
             }

             @media (min-width: 1200px){
               body {
                 font-size: 24px;
               }
             }
             * {
               box-sizing:border-box;
             }

             div.root {
               display: flex;
               color: white;
               flex-direction: column;
               max-width:800px;
               margin: 0 auto;
               padding:1em;
             }

             div.case {
               min-height:100vh;
               display: flex;
               justify-content: center;
               flex-direction: column;
             }

             section {
               margin-bottom: 2em;
             }

             section > .cols {
               position:relative;
               width: 100%;
               display: flex;

             }

             section > .cols > p {
               width:50%;
               padding-left: 1em;
               margin: 0;
             }

             section > .cols > p:first-child {
               padding-right: 1em;
               padding-left: 0;
             }

             section#work > p {
              font-family: Avenir Next LT W01 Bold;
             }

             section#work > .cases {

               font-size: 1.5em;
               line-height: 1.2em;
               word-break:break-all;

             }

             section#work a[href^=/] {
               color: yellow;
               text-decoration:underline;
               font-family:Baskerville W01 Italic;
             }

             section#work a[href^=http] {
               color: #cd7081;
             }

             section#work a:hover {
               color: #666;
             }

             footer {
               font-size: 0.6em;
               text-align: center;
               margin-top: 4em;
               margin-bottom: 0.5em;
               color: white;
             }

             footer .logo img {
               width: 6em;
             }

             @media (max-width: 720px) {
               section > .cols {
                 flex-direction: column;
               }

               section > .cols > p {
                 width:100%;
                 padding-left: 0em;
                 padding-right: 0em;
               }

               section > .cols > p:last-child {
                 margin-top: 1em;
               }
             }

           `}
         </style>
         <link type="text/css" rel="stylesheet" href="//fast.fonts.net/cssapi/3c9a48eb-44bb-48fd-a161-dffbfb189b99.css"/>
         <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
       </Head>
       <body>
         <Main />
         <NextScript />
       </body>
     </html>
    )
  }
}
