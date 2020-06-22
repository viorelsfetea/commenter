var path = require('path');

module.exports = {
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "src"),
                //exclude: [path.resolve(__dirname, "node_modules"), path.resolve(__dirname, "src/observers/RedditObserver.js")],
                use: "babel-loader"
            }
        ]
    }
};
