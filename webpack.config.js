/* --------------------------------------------------------------------
 * Fill in module info here.
 */

var info = {
    entries: {

        "docker/docker": [
            "docker/containers.js"
        ],
        "docker/console": [
            "docker/console.js",
        ],

    },

    tests: [
        "docker/test-docker",
    ],

    files: [
        "docker/console.html",
        "docker/index.html",
        "docker/images/drive-harddisk-symbolic.svg",
        "docker/manifest.json",
        "docker/css",
        "docker/js",
        "docker/fonts"
    ]
    
};

var externals = {
    "cockpit": "cockpit",
    "jquery": "jQuery",
};

/* ---------------------------------------------------------------------
 * Implementation
 */

var webpack = require("webpack");
var copy = require("copy-webpack-plugin");
var html = require('html-webpack-plugin');
var miniCssExtractPlugin = require('mini-css-extract-plugin');
var path = require("path");
var fs = require("fs");

/* These can be overridden, typically from the Makefile.am */
var srcdir = process.env.SRCDIR || __dirname;
var builddir = process.env.BUILDDIR || __dirname;
var distdir = builddir + path.sep + "dist";
var libdir = path.resolve(srcdir, "pkg" + path.sep + "lib");
var nodedir = path.resolve(srcdir, "node_modules");
var section = process.env.ONLYDIR || null;

/* A standard nodejs and webpack pattern */
var production = process.env.NODE_ENV === 'production';

/*
 * Note that we're avoiding the use of path.join as webpack and nodejs
 * want relative paths that start with ./ explicitly.
 *
 * In addition we mimic the VPATH style functionality of GNU Makefile
 * where we first check builddir, and then srcdir. In order to avoid
 * people having to run ./configure to hack on Cockpit we also help
 * resolve files that have a '.in' suffix if the resulting file
 * doesn't exist.
 */

function vpath(/* ... */) {
    var filename = Array.prototype.join.call(arguments, path.sep);
    var expanded = builddir + path.sep + filename;
    if (fs.existsSync(expanded))
        return expanded;
    expanded = srcdir + path.sep + filename;
    if (!fs.existsSync(expanded) && fs.existsSync(expanded + ".in"))
        return expanded + ".in";
    return expanded;
}

/* Qualify all the paths in entries */
Object.keys(info.entries).forEach(function(key) {
    if (section && key.indexOf(section) !== 0) {
        delete info.entries[key];
        return;
    }

    info.entries[key] = info.entries[key].map(function(value) {
        if (value.indexOf("/") === -1)
            return value;
        else
            return vpath("pkg", value);
    });
});

/* Qualify all the paths in files listed */
var files = [];
info.files.forEach(function(value) {
    if (!section || value.indexOf(section) === 0)
        files.push({ from: vpath("pkg", value), to: value });
});
info.files = files;

// Hide mini-css-extract-plugin spam logs
class CleanUpStatsPlugin {
  shouldPickStatChild(child) {
    return child.name.indexOf('mini-css-extract-plugin') !== 0;
  }

  apply(compiler) {
    compiler.hooks.done.tap('CleanUpStatsPlugin', (stats) => {
      const children = stats.compilation.children;
      if (Array.isArray(children)) {
        stats.compilation.children = children
          .filter(child => this.shouldPickStatChild(child));
      }
    });
  }
}

var plugins = [
    new copy(info.files),
    new miniCssExtractPlugin("[name].css"),
    new CleanUpStatsPlugin(),
    new webpack.ProvidePlugin({
       $: "jquery",
       jQuery: "jquery"
    }),
];

var output = {
    path: distdir,
    filename: "[name].js",
    sourceMapFilename: "[file].map",
};

/* Only minimize when in production mode */
if (production) {
    /* Rename output files when minimizing */
    output.filename = "[name].min.js";
}

/* Fill in the tests properly */
info.tests.forEach(function(test) {
    var ext = production ? ".min.js" : ".js";
    if (!section || test.indexOf(section) === 0) {
        info.entries[test] = vpath("pkg", test + ".js");
        plugins.push(new html({
            title: path.basename(test),
            filename: test + ".html",
            template: libdir + path.sep + "qunit-template.html",
            builddir: test.split("/").map(function() { return "../" }).join(""),
            script: path.basename(test + ext),
            inject: false,
        }));
    }
});

var aliases = {
    "d3": "d3/d3.js",
    "moment": "moment/moment.js",
};

/* HACK: To get around redux warning about reminimizing code */
if (production)
    aliases["redux/dist/redux"] = "redux/dist/redux.min.js";


var babel_loader = {
    loader: "babel-loader",
    options: {
        presets: [
            ["@babel/env", {
                "targets": {
                    "chrome": "57",
                    "firefox": "52",
                    "safari": "10.3",
                    "edge": "16",
                    "opera": "44"
                }
            }],
            "@babel/preset-react"
        ]
    }
}

module.exports = {
    mode: production ? 'production' : 'development',
    resolve: {
        alias: aliases,
        modules: [ libdir, nodedir ],
        extensions: ["*", ".js", ".json"]
    },
    entry: info.entries,
    output: output,
    externals: externals,
    plugins: plugins,

    devtool: "source-map",

    // disable noisy warnings about exceeding the recommended size limit
    performance: {
        maxAssetSize: 20000000,
        maxEntrypointSize: 20000000,
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|es6|jsx)$/,
                exclude: /\/node_modules\/.*\//, // exclude external dependencies
                loader: "eslint-loader"
            },
            {
                test: /\.js$/,
                exclude: /\/node_modules\/.*\//, // exclude external dependencies
                loader: 'strict-loader' // Adds "use strict"
            },
            /* these modules need to be babel'ed, they cause bugs in their dist'ed form */
            {
                test: /\/node_modules\/.*(@novnc|react-table).*\.js$/,
                use: babel_loader
            },
            {
                test: /\.(js|jsx|es6)$/,
                // exclude external dependencies; it's too slow, and they are already plain JS except the above
                exclude: /\/node_modules\/.*\//,
                use: babel_loader
            },
            {
                test: /\.css$/,
                use: [
                    miniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { url: false }
                    }
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    miniCssExtractPlugin.loader,
                    "css-loader",
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                            // Make PF3 and PF4 variables globably accessible to be used by the components scss
                            options: {
                                resources: [
                                    path.resolve(libdir, './_global-variables.scss'),
                                    path.resolve(nodedir, './@patternfly/patternfly/patternfly-variables.scss'),
                                    path.resolve(nodedir, './patternfly/dist/sass/patternfly/_variables.scss')
                                ],
                            },
                    },
                ]
            },
        ],
    }
};
