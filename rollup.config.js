import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/umd.js',
    output: {
      format: 'umd',
      file: 'index.js',
      name: 'COVIDCharts',
      sourcemap: false
    },
    plugins: [
      commonjs(),
      resolve(),
      terser()
    ]
  }
]
