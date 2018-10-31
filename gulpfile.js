const { src, dest } = require('gulp');
const flatten = require("gulp-flatten");

const path = {
    dev: 'app/dev/**/*.*',
    js: 'app/build/js',
    css: 'app/build/css',
    img: 'app/build/img',
    other: 'app/build/other',
    default: 'app/build/'
};

const extencions = {
    img: /\.(png|jpg|jpeg|svg|gif)+/,
    main: /\.(html|ico)/,
    js: '.js',
    css: '.css'
}

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

exports.default = rebuild;