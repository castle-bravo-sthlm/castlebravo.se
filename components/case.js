export default ({children, ...rest}) => (
    <div className="case">
      {children}

      <style jsx global>{`
        div.case {
          display: flex;
          color: white;
          flex-direction: column;
          align-items: center;
        }
        section {
          width: 60vw;
          margin-bottom: 2em;
          font-family: Baskerville W01 Regular_705699;
        }

        section#video > div {
          position: relative;
          width: 60%;
          padding-bottom: 40%;
        }

        section#video {
          margin-top: 2em;
          display: flex;
          justify-content: center;
        }

        a {
          color: yellow;
        }

        p {
          margin: 0;
          font-size: 1em;
        }

        p + p {
          margin-top: 1em;
          font-size: 1em;
        }

        .cols {
          width: 100%;
          display: flex;
        }

        .cols > p {
          width:50%;
          padding-left: 1em;
          margin: 0;
        }

        .cols > p:first-child {
          padding-right: 1em;
          padding-left: 0;
        }

        .cols + p {
          margin-top: 1.5em;
        }

        section h1, section h2 {
          margin: 0.5em 0;
          font-size: 1.5em;
          font-family: Avenir Next LT W01 Bold;
        }


        @media (max-width: 720px) {
          section {
            width: 80vw;
          }

          .cols {
            flex-direction: column;
          }

          .cols > p {
            width:100%;
            padding-left: 0em;
            padding-right: 0em;
          }

          .cols > p:last-child {
            margin-top: 1em;
          }
        }

        .player {
          position: absolute;
          width: 100%;
          height: 100%;
          box-shadow: 15px 15px 0px 0px #162931;
        }
      `}</style>
    </div>
)
