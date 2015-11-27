import URIRewriter from './uri-rewriter'



const Plugin = (server, versions, ignore) => {
  server.ext('onRequest', URIRewriter(versions, ignore))
}



export default Plugin
