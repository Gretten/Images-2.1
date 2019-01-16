const modules = require('./core/modules');

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
    return modules.src(modules.path.index, { allowEmpty: true })
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
    const reg = /[^\/]*(\.jpg|\.jpeg|\.png|\.gif|\.svg|\.css|\.js)/gi;
    return modules.src([modules.path.dev], { allowEmpty: true })
        .pipe(modules.gulpif(modules.argv.preland, modules.cheerio(function($) {
            $(this).attr('href', '');
        })))
        .pipe(modules.cheerio(function($) {
            $('form').each(function() {
                $(this).attr('action', '');
            })
            $('select').each(function() {
                $(this).attr('name', 'country');
                $(this).html('');
            })
            $('input', 'form').each(function() {
                switch($(this).attr('type')) {
                    case 'tel':
                        $(this).attr('name', 'phone');
                        break;
                    case 'text':
                        $(this).attr('name', 'name');
                        break;
                    case 'hidden':
                    case 'checkbox':
                        $(this).remove();
                        break;
                    
                }
            })
            $('script').each(function() {
                if($(this).attr('src')) {
                    $(this).attr('src', `js/${$(this).attr('src').match(reg)}`)
                }
            })
            $('link').each(function() {
                if($(this).attr('rel') === 'stylesheet') {
                    $(this).attr('href', `css/${$(this).attr('href').match(reg)}`)
                } else if($(this).attr('rel') === 'icon') {
                    $(this).remove();
                }
            })
            $('img').each(function() {
                if($(this).attr('src')) {
                    $(this).attr('src', `img/${$(this).attr('src').match(reg)}`)
                }
            })
            $('head').prepend('<base href="<?php echo $base_url;?>">');
            $('body').append('<?php include ($root_path."app2/counters.php");>\n<?php include ($root_path."app2/scriptsLanding.php");>\n');
        }))
        .pipe(modules.entities('decode'))
        .pipe(modules.dest(modules.path.default));
}

const cleanDirectories = () => {
    return modules.src([modules.path.default, modules.path.dev], { read: false, allowEmpty: true })
        .pipe(modules.clean());
}

exports.links = cleanAttributes;
exports.rebuild = modules.series(rebuildProject, deleteComments, cleanAttributes, cleanDirectories);