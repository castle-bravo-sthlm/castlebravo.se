export default ({pathname, title, ...rest}) => (

    <section id="share">
      <a href={`https://www.facebook.com/sharer/sharer.php?u=https://castlebravo.se${pathname}`} target="_blank"><img src="/static/share/facebook.svg" /></a>
      <a href={`https://linkedin.com/shareArticle?url=https://castlebravo.se${pathname}&title=${title}`} target="_blank"><img src="/static/share/linkedin.svg" /></a>
      <a href={`https://twitter.com/intent/tweet?url=https://castlebravo.se${pathname}`} target="_blank"><img src="/static/share/twitter.svg" /></a>

      <style jsx>
      {`
        #share {
          text-align: center;
          margin-top: 2em;
        }

        #share img {
          width: 1.5em;
          margin-right: 1em;
          box-shadow: 3px 3px 1px 0px #666;
        }

        #share a {
          margin-right: 1em;
        }

        #share img:hover{
          position: relative;
          box-shadow: none;
          top: 3px;
          right: -3px;
        }

        #share a:last-child {
          margin-right: 0;
        }
      `}
      </style>
    </section>
)
