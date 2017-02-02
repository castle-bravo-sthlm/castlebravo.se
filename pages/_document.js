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

           `}
         </style>
         <link type="text/css" rel="stylesheet" href="//fast.fonts.net/cssapi/3c9a48eb-44bb-48fd-a161-dffbfb189b99.css"/>
       </Head>
       <body>
         <Main />
         <NextScript />
       </body>
     </html>
    )
  }
}
