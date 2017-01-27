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
               background-color: #1a1a1a;
               margin: 0;
               font-size: 16px;
               line-height: 1.2em;
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

             footer {
               font-size: 0.6em;
               text-align: center;
               margin-top: 4em;
               margin-bottom: 0.5em;
               color: white;
             }

             .logo img {
               width: 6em;
             }

             h1, h2 {
               margin: 0.5em 0;
               font-size: 1.5em;
               line-height: 1.2em;
               font-family: Avenir Next LT W01 Bold;
             }
           `}
         </style>
         <link type="text/css" rel="stylesheet" href="//fast.fonts.net/cssapi/3c9a48eb-44bb-48fd-a161-dffbfb189b99.css"/>
       </Head>
       <body>
         <Main />
         <NextScript />
         <footer>
            <div className="logo"><img src="/static/logo.svg" /></div>
            Tomtebogatan 5 | 113 39 STOCKHOLM | +46 8 52 20 50 00 | hello@castlebravo.se
          </footer>
       </body>
     </html>
    )
  }
}
