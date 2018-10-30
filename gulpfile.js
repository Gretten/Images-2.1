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

const rebuild = () => {
    return src(path.dev)
        .pipe(flatten())
        .pipe(dest((file) => {
            return file.extname === '.js' ? `${path.js}` :
                file.extname === '.css' ? `${path.css}` :
                file.extname === '.+(png|jpg|jpeg|gif)' ? `${path.img}` :
                file.extname === '.+(html|ico)' ? `${path.default}` :
                `${path.other}`;
        }));
};

const debug = () => {
    return src(path.dev)
        .on('data', (file) => {
            console.log({
                path: file.path,
                cwd: file.cwd,
                base: file.base,
                // another
                relative: file.relative,
                dirname: file.dirname,
                basename: file.basename,
                stem: file.stem,
                extname: file.extname,
                extname: file.extname
            })
            if (file.extname === '+(.png|.jpg)') {
                console.log('its an image')
            }
        })
};

exports.default = rebuild;
exports.debug = debug;

//