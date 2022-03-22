import typescript from'@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'bild/index.js',
    format: 'cjs'
  },
  plugins:[typescript({tsconfig:'./tsconfig.json'})]
};