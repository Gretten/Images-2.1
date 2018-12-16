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
    main: /\.(html|ico)+/,
    js: '.js',
    css: '.css'
}

module.exports = { path, extencions }