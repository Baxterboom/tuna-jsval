var name = 'tuna-jsval';

var path = {
    js: './src/',
    css: './src/',
    dist: './dist/'
};

var gulp = require('gulp');
var ts = require('gulp-typescript');
var minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');

//tasks - typescripts
gulp.task('ts:compile', function () {
    var tsSrc = ts.createProject("tsconfig.json", {
        outFile: name + '.js'
    });

    var minifyOptions = {
        ext: {
            src: '.js',
            min: '-min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    };

    return gulp.src(path.js + '**/*.ts')
        //.pipe(sourcemaps.init())
        .pipe(tsSrc())
        .pipe(minify(minifyOptions))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist));
});


gulp.task('ts-test:compile', function () {
    var tsTests = ts.createProject("tsconfig.tests.json", {
        outFile: name + '-tests.js'
    });

    return gulp.src(path.js + '**/*-test.ts')
        //.pipe(sourcemaps.init())
        .pipe(tsTests())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist));
});

//watchers
gulp.task('file:watch', function () {
    gulp.watch(path.js + '**/*.ts', gulp.series(['ts:compile']));
});

//setup build
gulp.task('build', gulp.series(['ts:compile', 'ts-test:compile']));