import gulp from 'gulp';
import browserSync from 'browser-sync';

import gulpsass from 'gulp-sass';
import sasscomp from 'sass';


import concat from 'gulp-concat';
import cleancss from 'gulp-clean-css';

const bsInstante = browserSync.create();
const outputPath = './release';
const sass = gulpsass(sasscomp);


function browsersync() {
   bsInstante.init({
      server: { baseDir: outputPath },
      notify: false,
      online: false
   });
}

function pages() {
   return gulp.src('basis/index.html')
      .pipe(gulp.dest(outputPath))
      .pipe(bsInstante.stream());
}

function images() {
   return gulp.src('basis/image/*.*')
      .pipe(gulp.dest(outputPath + '/image'))
      .pipe(bsInstante.stream());
}

function styles() {
   return gulp.src('basis/*.scss')
      .pipe(sass())
      .pipe(gulp.dest(outputPath))
      .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
      .pipe(concat('style.min.css'))
      .pipe(gulp.dest(outputPath))
      .pipe(bsInstante.stream());
}


function monitoring() {
   gulp.watch('basis/*.html').on('change', () => {
      pages();
      bsInstante.reload;
   })
   gulp.watch('basis/*.scss').on('change', () => {
      styles();
      bsInstante.reload;
   })
   gulp.watch('basis/image/*.*').on('change', () => {
      images();
      bsInstante.reload;
   })
}

const build = gulp.series(pages, images, styles);
const serve = gulp.series(build, gulp.parallel(browsersync, monitoring));

export {
   build,
   serve
}

export default build;
