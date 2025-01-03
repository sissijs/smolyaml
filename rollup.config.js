import terser from '@rollup/plugin-terser'
import pkg from './package.json' with { type: 'json' }

const EXTERNAL = [] // external modules
const GLOBALS = {} // https://rollupjs.org/guide/en/#outputglobals
const OUTPUT_DIR = 'dist'

// Why rollup although there is only one file as of current?
// We might want to switch the regular expression engine to https://github.com/le0pard/re2js in the future,
// which can effectively safeguard smolyaml from ReDoS attacks.  

const makeConfig = () => {
  const banner = `/*!
 * ${pkg.name}
 * ${pkg.description}
 *
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @homepage ${pkg.homepage}
 * @repository ${pkg.repository}
 * @license ${pkg.license}
 */`

  return [{
    input: 'src/smolyaml.js',
    external: EXTERNAL,
    output: [
      {
        banner,
        file: `${OUTPUT_DIR}/smolyaml.js`,
        format: 'es',
        exports: 'auto',
        globals: GLOBALS,
        sourcemap: true
      }
    ],
    plugins: [terser()]
  },
  ]
}

export default () => makeConfig()
