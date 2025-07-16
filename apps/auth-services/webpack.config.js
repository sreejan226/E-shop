const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const { execSync } = require('child_process');

// Generate Swagger documentation
try {
  execSync('node src/generate-swagger.js', { cwd: __dirname });
} catch (error) {
  console.error('Error generating swagger documentation:', error);
}

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [
        "./src/assets",
        { 
          glob: "swagger-output.json", 
          input: "src", 
          output: "apps/auth-services/src" 
        }
      ],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    })
  ],
};
