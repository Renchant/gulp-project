var path = require( 'path' );
var fs = require( 'fs' );
var SETTING = require( './setting' );

function genEntries() {
    var jsDir = path.resolve( SETTING.src.js );
    console.log(jsDir);
    var names = fs.readdirSync(jsDir);
    console.log(names);
    var map = {};

    names.forEach(function(name) {
        var m = name.match(/(.+)\.js$/);
        console.log(m);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(jsDir, name) : '';

        if(entry) map[entry] = entryPath;
    });

    return map;
}

console.log(genEntries());

module.exports = {
	entry: genEntries(),
	output: {
		path: path.resolve( SETTING.dist.js ),
		filename: '[name].js',
        publicPath: 'http://h5img.yyyad.com/project/' + SETTING.name + '/dist/',
        // publicPath: '/static/web/' + SETTING.name + '/dist/',
	},

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                include: /src\/js/,
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'images/[folder]/[name]_[hash:8].[ext]'
                }
            }
        ]
    }
};