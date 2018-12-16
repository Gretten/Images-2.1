const { src, dest, series }   = require('gulp');
const flatten                 = require("gulp-flatten");
const cheerio                 = require('gulp-cheerio');
const entities                = require('gulp-html-entities');
const strip                   = require('gulp-strip-comments');
const argv                    = require('yargs').argv;
const gulpif                  = require('gulp-if');
const fs                      = require('fs');

const handler                 = require('./functions');
const { path, extencions }    = require('./options');

const rebuild = () => {
    return src(path.dev)
        .pipe(flatten())
        .pipe(dest((file) => {
            return file.extname === extencions.js ? path.js :
                file.extname === extencions.css ? path.css :
                file.extname.match(extencions.img) ? path.img :
                file.extname.match(extencions.main) ? path.default :
                path.other;
        }));
};

const comments = () => {
    return src(path.index)
      .pipe(strip({safe: true}))
      .pipe(cheerio(function($) {
        $('meta').each(function() {
            if(this.parent.name === 'html' && 
               this.parent.children[1].name === 'meta') {
               this.parent.children[1] = ''
            } else if(!this.parent.children[1].name === 'meta') {
                console.log('Ошибка в инструкции "comments"');
            }
        })}))
      .pipe(entities('decode'))
      .pipe(dest(path.default))
}

const links = () => {
    return src([path.index])
        .pipe(gulpif(argv.preland, cheerio(function($){
            $('a').each(function(){
                this.attribs.href = "";
            })
        })))
        .pipe(cheerio(function($) {
            $('img').each(function() {
                handler.call(this);
            });
            $('script').each(function() {
                handler.call(this);
            });
            $('link').each(function() {
                handler.call(this);
            });
            $('form').each(function() {
                this.attribs.action = "";
            });
        }))
        .pipe(entities('decode'))
        .pipe(dest(path.default));
}

exports.default = rebuild;
exports.links = links;
exports.rebuild = series(rebuild, comments, links);