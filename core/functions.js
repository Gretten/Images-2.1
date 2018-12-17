function pathHandler() {
    let attrs = this.attribs;
    let check = /\.(jpg|png|jpeg|gif|svg)/gi;
    let reg = /[^\/]*(\.jpg|\.jpeg|\.png|\.gif|\.svg|\.css|\.js)/gi;
    if (attrs.src) {

        if (~attrs.src.indexOf('.js')) {
            let clean = attrs.src.match(reg)[0];
            this.attribs.src = 'js/' + clean;
        } else if (~attrs.src.search(check)) {
            let clean = attrs.src.match(reg)[0];
            this.attribs.src = 'img/' + clean;
        } else {
            console.log('Ошибка в ' + attrs.src)
        }

    } else if (attrs.href) {
        if (~attrs.href.indexOf('.css')) {
            let clean = attrs.href.match(reg)[0];
            this.attribs.href = 'css/' + clean;
        } else {
            console.log('Ошибка в ' + attrs.href)
        }
    }
}

module.exports = pathHandler;