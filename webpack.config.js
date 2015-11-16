module.exports = {
    entry: "./dust.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        preLoaders: [{
            test: /\.js?$/,
            loaders: ['jshint'],
            // define an include so we check just the files we need
            include: "./dust.js"
        }],
        loaders: [
            // { test: /\.css$/, loader: "style!css" }
        ]
    }
};
