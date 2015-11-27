
const patternVersion = 'v(\\d[\\d|\\.]*)'
const patternVersionAcceptHeader = `.*\\/vnd.littlebits.${patternVersion}\\+json`
const patternVersionURI = `\\/${patternVersion}(?:\\/.*)*`

const regExpVersion = RegExp(patternVersion)
const regExpVersionURI = RegExp(patternVersionURI)
const regExpVersionAcceptHeader = RegExp(patternVersionAcceptHeader)


const extract = (path) => {
  const v = path.match(regExpVersionURI)
  return v && v[1]
}

const strip = (path) => (
  path.replace(RegExp(`/${patternVersion}`), '')
)

const replace = (v, path) => (
  `/v${v}${strip(path)}`
)



export default {
  replace,
  extract,
  strip,
  regExpVersion,
  regExpVersionURI,
  regExpVersionAcceptHeader,
}

export {
  replace,
  extract,
  strip,
  regExpVersion,
  regExpVersionURI,
  regExpVersionAcceptHeader,
}
