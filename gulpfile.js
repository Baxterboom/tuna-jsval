var name = 'tuna-val';

var path = {
    js: './src/',
    css: './src/',
    dist: './dist/'
};

var gulp = require('gulp');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');

//tasks - sass
gulp.task('scss:compile', function () {
    gulp.src(path.css + '**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist));
    //.pipe(gulp.dest(path.projdir));
});

//tasks - typescripts
gulp.task('typescript:compile', function () {
    var tsSrc = ts.createProject("tsconfig.json", { outFile: name + '.js' });
    var tsTests = ts.createProject("tsconfig.tests.json", { outFile: name + '-tests.js' });

    var minifyOptions = {
        ext: {
            src: '.js',
            min: '-min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    };

    return [
        gulp.src(path.js + '**/*.ts')
            //.pipe(sourcemaps.init())
            .pipe(tsSrc())
            .pipe(minify(minifyOptions))
            //.pipe(sourcemaps.write())
            .pipe(gulp.dest(path.dist)),

        gulp.src(path.js + '**/*-test.ts')
            //.pipe(sourcemaps.init())
            .pipe(tsTests())
            //.pipe(minify(minifyOptions))
            //.pipe(sourcemaps.write())
            .pipe(gulp.dest(path.dist))
    ];
});

//watchers
gulp.task('file:watch', function () {
    gulp.watch(path.js + '**/*.ts', ['typescript:compile']);
    gulp.watch(path.css + '**/*.scss', ['scss:compile']);
});

//setup build
gulp.task('build', ['scss:compile', 'typescript:compile']);