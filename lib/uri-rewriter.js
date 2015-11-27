import lo from 'lodash'
import ver from './v'
import boom from 'boom'



const noop = () => undefined






// Parse the API verison from the Accept header

const parseVersionFromHeader = (header) => {
  const results = header.match(ver.regExpVersionAcceptHeader)
  return header && results
    ? parseInt(results[1], 10)
    : null
}

const parseVersionfromRequestURI = (uri) => {
  const results = uri.match(ver.regExpVersionURI)
  return results
    ? parseInt(results[1], 10)
    : null
}

const fromRequestURI = (req) => (
  parseVersionfromRequestURI(req.url.path)
)

const fromRequestHeaders = (req) => {
  // Request 'Accept' header might have the version
  // specified which we should honour and read from:
  const header = req.raw.req.headers.accept
  return header ? parseVersionFromHeader(header) : null
}






const createParser = (versions, ignore = noop) => (
  // Parse the API version from a request
  function requestVersioner (r, reply) {
    const v = fromRequestHeaders(r)
    const v_ = fromRequestURI(r)

    if (v && v_ && (v !== v_)) {
      return reply(boom.badRequest('Version mismatch between URI and Accept Header.'))
    }

    if (v) {
      r.setUrl(ver.replace(v, r.url.path))
      return reply.continue()
    }

    if (v_) {
      return reply.continue()
    }

    // else

    // TODO assume bleeding edge is being red
    if (!ignore(r)) r.setUrl(ver.replace(lo.max(versions), r.url.path))
    reply.continue()

    // TODO cases that should return an invalid version error
    // next(boom.badRequest('Missing valid Accept header with specified API version. Need help? See https://developer.littlebitscloud.cc/api-rest#version'))
  }
)











export default createParser
