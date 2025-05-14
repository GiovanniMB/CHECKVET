import { src, dest, watch, parallel } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import fileInclude from 'gulp-file-include';

const sass = gulpSass(dartSass);


const paths = {
  scss: 'src/scss/**/*.scss',
  html: 'src/html/pages/**/*.html',
  partials: 'src/html/partials/**/*.html',
  dest: {
    css: 'build/css',
    html: 'build/html'
  }
};


export function css() {
  return src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(paths.dest.css));
}


export function html() {
  return src(paths.html)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@root',
      indent: true,
      context: {
        projectName: 'CHECKVET',
        version: '1.0.0'
      }
    }))
    .pipe(dest(paths.dest.html));
}


export function dev() {
  watch(paths.scss, css);
  watch([paths.html, paths.partials], html);
}

export default parallel(css, html);