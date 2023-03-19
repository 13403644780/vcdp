import typescript2 from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import image from '@rollup/plugin-image'
const isProduction = process.env.NODE_ENV === 'production';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/happy-player.cjs.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'lib/happy-player.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      typescript2({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            target: isProduction ? 'es5' : 'es2015'
          }
        }
      }),
      image()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];

export default config
