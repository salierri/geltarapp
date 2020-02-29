var path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    // Change to your "entry-point".
    entry: './src/index',
    externals: [nodeExternals()],
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            // Include ts, tsx, js, and jsx files.
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    }
};
