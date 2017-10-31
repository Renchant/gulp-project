var path = require( 'path' );
var fs = require( 'fs' );
var SETTING = require( './setting' );

function genEntries() {
    var jsDir = path.resolve( SETTING.src.js );
    var names = fs.readdirSync(jsDir);
    var map = {};

    names.forEach(function(name) {
        var m = name.match(/(.+)\.js$/);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(jsDir, name) : '';

        if(entry) map[entry] = entryPath;
    });

    return map;
}

module.exports = {
	entry: genEntries(),
	output: {
		path: path.resolve( SETTING.dev.js ),
		filename: '[name].js',
        publicPath: '/static/web/' + SETTING.name + '/__dev/',
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
                    name: 'images/[folder]/[name].[ext]'
                }
            }
        ]
    }
    
};