var path = require('path'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    watchPath = require('gulp-watch-path'),
    rimraf = require('rimraf'),
    deleteFile = require('gulp-delete-file'),
    minifycss = require('gulp-clean-css'),
    cssBase64 = require('gulp-css-base64'),
    md5 = require('gulp-md5-plus'),
    uglify = require('gulp-uglify'),
    htmlMin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    filter = require('gulp-filter'),
    replace = require('gulp-replace'),
    qiniu = require('gulp-qiniu');


var SETTING = require( './setting' );

var _SRC_ = SETTING.src,
    _DIST_ = SETTING.dist,
    _DEV_ = SETTING.dev,
    useWebpack = SETTING.useWebpack;



/***** start dev task ******/
// gulp.task(name[, deps], fn) 定义一个使用 Orchestrator 实现的任务（task

// 删除 dev 文件
gulp.task( 'clean:dev', function( cb ) {
    return rimraf( _DEV_.root, cb );
} )

// 一个包含任务列表的数组，这些任务会在你当前任务运行之前完成 clean:dev 会在 copy-images:dev 之前完成
// 处理image gulp.src输出（Emits）符合所提供的匹配模式（glob）或者匹配模式的数组（array of globs）的文件。 将返回一个 Vinyl files 的 stream 它可以被 piped 到别的插件中
// 写入'__dev/images'中
gulp.task( 'copy-images:dev', ['clean:dev'], function() {
    return gulp.src( _SRC_.images + '/**/*' )
            .pipe( gulp.dest( _DEV_.images ) );
});

// 写入第三方插件
gulp.task( 'copy-libs:dev', ['clean:dev'], function() {
    return gulp.src( _SRC_.libs + '/**/*' )
            .pipe( gulp.dest( _DEV_.libs ) );
});

// 写入静态资源如veido等
gulp.task( 'copy-static:dev', ['clean:dev'], function() {
    return gulp.src( _SRC_.static + '/**/*' )
            .pipe( gulp.dest( _DEV_.static ) );
});

// js
gulp.task( 'js:dev', ['clean:dev'], function( cb ) {
    try {
        var webpack = require('webpack');
        var webpackConf = require('./webpack.dev.config.js');
    } catch(e) {
        useWebpack = false;
    };

    useWebpack ?
        webpack( webpackConf, function(err, stats) {
            if(err) throw new gutil.PluginError( 'webpack', err );
            gutil.log( '[webpack]', stats.toString( {colors: true} ) );
        } ) :
        gulp.src( _SRC_.js + '/**/*.js' ).pipe( gulp.dest( _DEV_.js ) );
});

// sass  https://www.npmjs.com/package/gulp-sass
gulp.task( 'sass:dev', ['clean:dev'], function() {
    return gulp.src( _SRC_.sass + '/*.scss' )
            .pipe( sass().on( 'error', sass.logError ) )
            .pipe( autoprefixer( {
                browsers: [ 'Android >= 4', 'Chrome >= 30', 'iOS >= 6' ]
            } ) )
            .pipe( cssBase64( {
                maxWeightResource: 10*1024,
            } ) )
            .pipe( gulp.dest( _DEV_.css ) );
});

/***** end dev task ******/



/***** start build task ******/

gulp.task( 'clean', function( cb ) {
    return rimraf( _DIST_.root, cb );
} )

gulp.task( 'copy-images', ['clean'], function() {
    return gulp.src( _SRC_.images + '/**/*' )
            .pipe( gulp.dest( _DIST_.images ) );
});

gulp.task( 'copy-libs', ['clean'], function() {
    return gulp.src( _SRC_.libs + '/**/*' )
            .pipe( gulp.dest( _DIST_.libs ) );
});

gulp.task( 'copy-static', ['clean'], function() {
    return gulp.src( _SRC_.static + '/**/*' )
            .pipe( gulp.dest( _DIST_.static ) );
});

gulp.task( 'js', ['clean'], function( cb ) {
    try {
        var webpack = require('webpack');
        var webpackConf = require('./webpack.config.js');
    } catch(e) {
        useWebpack = false;
    };

    useWebpack ?
        webpack( webpackConf, function(err, stats) {
            if(err) throw new gutil.PluginError( 'webpack', err );
            gutil.log( '[webpack]', stats.toString( {colors: true} ) );
        } ) :
        gulp.src( _SRC_.js + '/**/*.js' ).pipe( gulp.dest( _DIST_.js ) );
});

gulp.task( 'sass', ['clean'], function() {
    return gulp.src( _SRC_.sass + '/*.scss' )
            .pipe( sass().on( 'error', sass.logError ) )
            .pipe( autoprefixer( {
                browsers: [ 'Android >= 4', 'Chrome >= 30', 'iOS >= 6' ]
            } ) )
            .pipe( cssBase64( {
                maxWeightResource: 10*1024,
            } ) )
            .pipe( gulp.dest( _DIST_.css ) );
});

/***** end build task ******/



/***** start optimize task ******/

gulp.task( 'clean-html:dev', function( cb ) {
    return rimraf( _DEV_.html + '/**/*.html', cb );
});

gulp.task( 'copy-html:dev', ['clean-html:dev'], function() {
    return gulp.src( _SRC_.html + '/**/*.html' )
            .pipe(htmlMin({
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true
            }))
            .pipe( gulp.dest( _DEV_.html ) );
});

gulp.task( 'clean-html', function( cb ) {
    return rimraf( _DIST_.html + '/**/*.html', cb );
});

gulp.task( 'copy-html', ['clean-html'], function() {
    return gulp.src( _SRC_.html + '/**/*.html' )
            .pipe( replace( '/' + _DEV_.root + '/', '/' + _DIST_.root + '/' ) )
            .pipe(htmlMin({
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true
            }))
            .pipe( gulp.dest( _DIST_.html ) );
});

gulp.task( 'optimize-js', ['copy-html'], function() {
    return gulp.src( _DIST_.js + '/**/*.js' )
            .pipe( uglify() )
            .pipe( gulp.dest( _DIST_.js ) );
});

gulp.task( 'optimize-css', ['copy-html'], function() {
    return gulp.src( _DIST_.css + '/**/*.css' )
            .pipe( minifycss() )
            .pipe( gulp.dest( _DIST_.css ) );
});

gulp.task( 'md5-css', ['optimize-css'], function() {
    return gulp.src( _DIST_.css + '/**/*.css' )
            .pipe( md5( 8, _DIST_.html + '/*' ) )
            .pipe( gulp.dest( _DIST_.css ) );
} );

gulp.task( 'md5-js', ['optimize-js'], function() {
    return gulp.src( _DIST_.js + '/**/*.js' )
            .pipe( md5( 8, _DIST_.html + '/*' ) )
            .pipe( gulp.dest( _DIST_.js ) );
} );

gulp.task( 'delete-file', [ /*'md5-images',*/ 'md5-css', 'md5-js' ], function() {
    var reg = /\w*(\_\w{8}\.\w*){1}$/;
    return gulp.src( [
                _DIST_.css + '/**/*.*',
                _DIST_.js + '/**/*.js',
                // _DIST_.images + '/**/*.*',
            ], {read: false} )
            .pipe( deleteFile( {
                reg: reg,
                deleteMatch: false
            } ) )
} )

/***** end optimize task ******/



/***** start watch task ******/

function watchDog( type, src, dist ) {
    var colors = gutil.colors;
    gutil.log( colors.green( type ) + ' ' + src );
    gutil.log( 'DEV' + ' ' + dist );
}

gulp.task( 'watch-sass', function() {
    gulp.watch( _SRC_.sass + '/*.scss', function(e) {
        var paths = watchPath( e, _SRC_.sass, _DEV_.css );

        watchDog( e.type, paths.srcPath, paths.distPath );
        gulp.src( paths.srcPath )
            .pipe( sass().on( 'error', sass.logError ) )
            .pipe( cssBase64( {
                maxWeightResource: 10*1024,
            } ) )
            .pipe( autoprefixer( {
                browsers: [ 'Android >= 4', 'Chrome >= 30', 'iOS >= 6' ]
            } ) )
            .pipe( gulp.dest( paths.distDir ) );
    } )
} );

gulp.task( 'watch-images', function() {
    gulp.watch( _SRC_.images + '/**/*', function(e) {
        var paths = watchPath( e, _SRC_.images, _DEV_.images );

        watchDog( e.type, paths.srcPath, paths.distPath );
        e.type != 'deleted' ?
        gulp.src( paths.srcPath ).pipe( gulp.dest( paths.distDir ) ) :
        rimraf( paths.distPath, function(){} );
    } )
} );

gulp.task( 'watch-js', function() {
    try {
        var webpack = require('webpack');
        var webpackConf = require('./webpack.dev.config.js');
    } catch(e) {
        useWebpack = false;
    };

    gulp.watch( _SRC_.js + '/**/*.js', function(e) {
        var paths = watchPath( e, _SRC_.js, _DEV_.js );

        watchDog( e.type, paths.srcPath, paths.distPath );

        useWebpack ?
            webpack(webpackConf, function(err, stats) {
                if(err) throw new gutil.PluginError( 'webpack', err );
                gutil.log( '[webpack]', stats.toString( {colors: true} ) );
            }) :
            gulp.src( paths.srcPath ).pipe( gulp.dest( paths.distDir ) );

    } )
} );

gulp.task( 'watch-libs', function() {
    gulp.watch( _SRC_.libs + '/**/*', function(e) {
        var paths = watchPath( e, _SRC_.libs, _DEV_.libs );

        watchDog( e.type, paths.srcPath, paths.distPath );
        e.type != 'deleted' ?
        gulp.src( paths.srcPath ).pipe( gulp.dest( paths.distDir ) ) :
        rimraf( paths.distPath, function(){} );
    } )
} );


gulp.task( 'watch-static', function() {
    gulp.watch( _SRC_.static + '/**/*', function(e) {
        var paths = watchPath( e, _SRC_.static, _DEV_.static );

        watchDog( e.type, paths.srcPath, paths.distPath );
        e.type != 'deleted' ?
        gulp.src( paths.srcPath ).pipe( gulp.dest( paths.distDir ) ) :
        rimraf( paths.distPath, function(){} );
    } )
} );

gulp.task( 'watch-html', function() {
    gulp.watch( _SRC_.html + '/**/*', function(e) {
        var paths = watchPath( e, _SRC_.html, _DEV_.html );

        watchDog( e.type, paths.srcPath, paths.distPath );
        e.type != 'deleted' ?
        gulp.src( paths.srcPath ).pipe( gulp.dest( paths.distDir ) ) :
        rimraf( paths.distPath, function(){} );
    } )
} );

/***** end watch task ******/




gulp.task( 'dev', [ 'clean:dev', 'copy-html:dev', 'copy-images:dev', 'copy-libs:dev', 'copy-static:dev', 'sass:dev', 'js:dev' ] );

gulp.task( 'watch', [ 'watch-images', 'watch-sass', 'watch-js', 'watch-libs', 'watch-static', 'watch-html'] );

gulp.task( 'build', [ 'clean', 'copy-html', 'copy-images', 'copy-libs', 'copy-static', 'sass', 'js' ] );

gulp.task( 'optimize', [ 'delete-file' ] );

// 上传静态资源到七牛 CDN https://www.npmjs.com/package/gulp-qiniu
gulp.task( 'upload', function() {
    return gulp.src( 'dist/**/*' )
        .pipe( qiniu(
            SETTING.qiniu,
            {
                dir: '/project/' + SETTING.name + '/dist',
                concurrent: 10
            }
        ) );
} );
