const { src, dest, series } = require('gulp');
const flatten = require("gulp-flatten");
const cheerio = require('gulp-cheerio');
const entities = require('gulp-html-entities');
const strip = require('gulp-strip-comments');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const fs = require('fs');

const handler = require('./functions');
const { path, extencions } = require('./options');

module.exports = {
    src,
    dest,
    series,
    flatten,
    cheerio,
    entities,
    strip,
    argv,
    gulpif,
    fs,
    handler,
    path,
    extencions
}