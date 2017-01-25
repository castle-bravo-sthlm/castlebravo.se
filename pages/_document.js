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
             body {
               background-color: #1a1a1a;
               margin: 0;
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
