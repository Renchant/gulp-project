var pkg = require('./package.json').name;

module.exports = {
    name: pkg,
    useWebpack: true,
    src: {
        html: 'src/pages',
        root: 'src',
        sass: 'src/sass',
        js: 'src/js',
        images: 'src/images',
        libs: 'src/libs',
        static: 'src/static',
    },
    dev: {
        html: '__dev/pages',
        root: '__dev',
        css: '__dev/css',
        js: '__dev',
        images: '__dev/images',
        libs: '__dev/libs',
        static: '__dev/static',
    },
    dist: {
        html: 'dist/pages',
        root: 'dist',
        css: 'dist/css',
        js: 'dist',
        images: 'dist/images',
        libs: 'dist/libs',
        static: 'dist/static',
    },
    qiniu: {
        accessKey: 'JSJQ9zNlL*******',
        secretKey: 'AKZ4wiEvB*******',
        bucket: '*******',
        private: false
    }
}