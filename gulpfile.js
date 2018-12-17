const modules = require('./modules');

const rebuildProject = () => {
    return modules.src(modules.path.dev)
        .pipe(modules.flatten())
        .pipe(modules.dest((file) => {
            return file.extname === modules.extencions.js ? modules.path.js :
                file.extname === modules.extencions.css ? modules.path.css :
                file.extname.match(modules.extencions.img) ? modules.path.img :
                file.extname.match(modules.extencions.main) ? modules.path.default :
                modules.path.other;
        }));
};

const deleteComments = () => {
    return modules.src(modules.path.index)
        .pipe(modules.strip({ safe: true }))
        .pipe(modules.cheerio(function($) {
            $('meta').each(function() {
                if (this.parent.name === 'html' &&
                    this.parent.children[1].name === 'meta') {
                    this.parent.children[1] = ''
                } else if (!this.parent.children[1].name === 'meta') {
                    console.log('Ошибка в инструкции "comments"');
                }
            })
        }))
        .pipe(modules.entities('decode'))
        .pipe(modules.dest(modules.path.default))
}

const cleanAttributes = () => {
    return modules.src([modules.path.index])
        .pipe(modules.gulpif(modules.argv.preland, modules.cheerio(function($) {
            $('a').each(function() {
                this.attribs.href = "";
            })
        })))
        .pipe(modules.cheerio(function($) {
            $('img').each(function() {
                modules.handler.call(this);
            });
            $('script').each(function() {
                modules.handler.call(this);
            });
            $('link').each(function() {
                modules.handler.call(this);
            });
            $('form').each(function() {
                this.attribs.action = "";
                console.log(this);
                console.log($);
            });
        }))
        .pipe(modules.entities('decode'))
        .pipe(modules.dest(modules.path.default));
}

exports.links = cleanLinks;
exports.rebuild = modules.series(rebuildProject, deleteComments, cleanAttributes);