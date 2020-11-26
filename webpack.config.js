const path = require('path');

module.exports = {
    entry: {
        'analyze-text': `${__dirname}/lambda/src/index-analyze-text.ts`,
        'find-positives': `${__dirname}/lambda/src/index-find-positives.ts`,
        'update-positives': `${__dirname}/lambda/src/index-update-positives.ts`,
    },
    output: {
        path: `${__dirname}/dest/pack`,
        filename: 'src/[name]/index.js',
        libraryTarget: 'commonjs2',
    },
    externals: [],
    target: 'node',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.ts$/,
                include: [path.resolve(__dirname, 'lambda/src')],
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        minimize: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
};
