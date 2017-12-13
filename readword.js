//MIME：多用途的网际邮件扩充类型。
//Multipurpose Internet Mail Extensions'
//是设定某种扩展名的文件用一种应用程序来打开的方式类型，当扩展名文件被访问时，浏览器会自动使用指定应用程序打开。
//多用于指定一些客户端自定义的文件名，以及一些媒体文件打开方式。

//严格模式:  
//不能使用未声明的变量
//消除代码运行的一些不安全之处，保证代码运行的安全；   
//提高编译器效率，增加运行速度； 
'use strict';

//模块引用
var mime = require('..');
var mimeTypes = require('../node_modules/mime-types');
//断言：用于检查“不应该发生的情况”，如果assert的参数为假，那么程序就会中止
var assert = require('assert');
//改变颜色：如chalk.blue('world');
var chalk = require('chalk');

//对测试用例或测试套件控制执行，即可用在it后面或describe后面。
describe('class Mime', function() {
    it('new constructor()', function() {
        //模块引用
        const Mime = require('../Mime');
        //创建MIME
        //定义MIME类型，自定义映射
        //如下面创建并引用Mime实例
        // const myMime = new Mime(typeMap);
        // myMime.getType('a1');            //  'text/a'
        // myMime.getExtension('text/b');  //  'b','b1'
        const mime = new Mime(     
          {'text/a': ['a', 'a1']},
          {'text/b': ['b', 'b1']}
        );

        //assert.deepEqual(actual, expected[, message]),原始值使用相等运算符（==）比较。
        assert.deepEqual(mime._types, {       
        //测试actual参数与expected 参数是否深度相等。原始值使用相等运算符(==)比较。
          a: 'text/a',
          a1: 'text/a',
          b: 'text/b',
          b1: 'text/b',
        });
        //extensions：扩展,测试类型与扩展是否相等
        assert.deepEqual(mime._extensions, {
          'text/a': 'a',
          'text/b': 'b',
        });
    });

    it('define()', function() {
        //引用模块
        const Mime = require('../Mime');
        //创建MIME实例
        const mime = new Mime({'text/a': ['a']}, {'text/b': ['b']});
        //断言函数抛出错误
        //mime.define(typeMap [，force = false])
        //默认情况下，如果您尝试将类型映射到已分配给其他类型的扩展，则此方法将引发错误。
        //传递true的force参数将抑制这种行为（覆盖任何以前的映射）。
        //如下：将已经分配给'text/b'的‘b’,分配给‘text/c’，
        assert.throws(function() {
            mime.define({'text/c': ['b']});
        });
        //断言函数不会抛出错误
        assert.doesNotThrow(function() {
            mime.define({'text/c': ['b']}, true);
        });
        //深度相等
        assert.deepEqual(mime._types, {
              xa: 'text/a',
              b: 'tet/c',
        });
        assert.deepEqual(mime._extensions, {
            'text/a': 'a',
            'text/b': 'b',
            'text/c': 'b',
        });
    });

    //mime.getType(path Or Extension)
    //mime.getExtension(type)
    it('getType()', function() {
        // 当大写/小写时，测试参数是否相等
        //assert.equal():使用‘==’判断，
        assert.equal(mime.getType('text.txt'), 'text/plain');
        assert.equal(mime.getType('TEXT.TXT'), 'text/plain');
        // 扩展名
        assert.equal(mime.getType('txt'), 'text/plain');
        assert.equal(mime.getType('.txt'), 'text/plain');
        //测试参数是否全等,使用全等运算符（===）
        //在未检测到或识别到扩展名的情况下返回null
        assert.strictEqual(mime.getType('.bogus'), null);
        assert.strictEqual(mime.getType('bogus'), null);
        // 非感性
        assert.strictEqual(mime.getType(null), null);
        assert.strictEqual(mime.getType(undefined), null);
        assert.strictEqual(mime.getType(42), null);
        assert.strictEqual(mime.getType({}), null);
        // 文件路径
        assert.equal(mime.getType('dir/text.txt'), 'text/plain');
        assert.equal(mime.getType('dir\\text.txt'), 'text/plain');
        assert.equal(mime.getType('.text.txt'), 'text/plain');
        assert.equal(mime.getType('.txt'), 'text/plain');
        assert.equal(mime.getType('txt'), 'text/plain');
        assert.equal(mime.getType('/path/to/page.html'), 'text/html');
        assert.equal(mime.getType('c:\\path\\to\\page.html'), 'text/html');
        assert.equal(mime.getType('page.html'), 'text/html');
        assert.equal(mime.getType('path/to/page.html'), 'text/html');


        assert.equal(mime.getType('path\\to\\page.html'), 'text/html');
        assert.strictEqual(mime.getType('/txt'), null);
        assert.strictEqual(mime.getType('\\txt'), null);
        assert.strictEqual(mime.getType('text.nope'), null);
        assert.strictEqual(mime.getType('/path/to/file.bogus'), null);
        assert.strictEqual(mime.getType('/path/to/json'), null);
        assert.strictEqual(mime.getType('/path/to/.json'), null);
        assert.strictEqual(mime.getType('/path/to/.config.json'), 'application/json');
        assert.strictEqual(mime.getType('.config.json'), 'application/json');
    });



    it('getExtension()', function() {
        assert.equal(mime.getExtension('text/html'), 'html');
        assert.equal(mime.getExtension(' text/html'), 'html');
        assert.equal(mime.getExtension('text/html '), 'html');
        assert.strictEqual(mime.getExtension('application/x-bogus'), null);
        assert.strictEqual(mime.getExtension('bogus'), null);
        assert.strictEqual(mime.getExtension(null), null);
        assert.strictEqual(mime.getExtension(undefined), null);
        assert.strictEqual(mime.getExtension(42), null);
        assert.strictEqual(mime.getExtension({}), null);
    });
});

describe('DB', function() {
    var diffs = [];
    //after:测试用例的钩子，
    //before：在本测试套件的所有测试用例之前执行
    //after：在本测试套件的所有测试用例之后执行
    //beforeEach：在本测试套件的每个测试用例之前执行
    //afterEach：在本测试套件的每个测试用例之后执行
    after(function() {
        if (diffs.length) {
            //有不一致
            console.log('\n[INFO] The following inconsistencies with MDN (https://goo.gl/lHrFU6) and/or mime-types (https://github.com/jshttp/mime-types) are expected:');
            //forEach()调用数组中的每个元素,chalk:改变颜色
            diffs.forEach(function(d) { 
                //sonsole.warn()是console.error()的另一个名字.
                console.warn(`  ${d[0]}[${chalk.blue(d[1])}] = ${chalk.red(d[2])},
                                 mime[${d[1]}] = ${chalk.green(d[3])}`);
            });
        }
    });
    //Consistency:一致性
    it('Consistency', function() {
        for (var ext in this.types) {
            //若不一致返回信息：'${ext}不具有一致的外部->类型->分机映射'
          assert.equal(ext, this.extensions[this.types[ext]], '${ext} does not have consistent ext->type->ext mapping');
                                                            
        }
    });

    it('MDN types', function() {
        // 在https://goo.gl/lHrFU6列出的MDN类型
        const MDN = {
            'aac': 'audio/aac',
            'abw': 'application/x-abiword',
            'arc': 'application/octet-stream',
            'avi': 'video/x-msvideo',
            'azw': 'application/vnd.amazon.ebook',
            'bin': 'application/octet-stream',
            'bz': 'application/x-bzip',
            'bz2': 'application/x-bzip2',
            'csh': 'application/x-csh',
            'css': 'text/css',
            'csv': 'text/csv',
            'doc': 'application/msword',
            'epub': 'application/epub+zip',
            'gif': 'image/gif',
            'html': 'text/html',
            'ico': 'image/x-icon',
            'ics': 'text/calendar',
            'jar': 'application/java-archive',
            'jpg': 'image/jpeg',
            'js': 'application/javascript',
            'json': 'application/json',
            'midi': 'audio/midi',
            'mpeg': 'video/mpeg',
            'mpkg': 'application/vnd.apple.installer+xml',
            'odp': 'application/vnd.oasis.opendocument.presentation',
            'ods': 'application/vnd.oasis.opendocument.spreadsheet',
            'odt': 'application/vnd.oasis.opendocument.text',
            'oga': 'audio/ogg',
            'ogv': 'video/ogg',
            'ogx': 'application/ogg',
            'png': 'image/png',
            'pdf': 'application/pdf',
            'ppt': 'application/vnd.ms-powerpoint',
            'rar': 'application/x-rar-compressed',
            'rtf': 'application/rtf',
            'sh': 'application/x-sh',
            'svg': 'image/svg+xml',
            'swf': 'application/x-shockwave-flash',
            'tar': 'application/x-tar',
            'tiff': 'image/tiff',
            'ttf': 'font/ttf',
            'vsd': 'application/vnd.visio',
            'wav': 'audio/x-wav',
            'weba': 'audio/webm',
            'webm': 'video/webm',
            'webp': 'image/webp',
            'woff': 'font/woff',
            'woff2': 'font/woff2',
            'xhtml': 'application/xhtml+xml',
            'xls': 'application/vnd.ms-excel',
            'xml': 'application/xml',
            'xul': 'application/vnd.mozilla.xul+xml',
            'zip': 'application/zip',
            '3gp': 'video/3gpp',
            '3g2': 'video/3gpp2',
            '7z': 'application/x-7z-compressed',
        };
        //MDN:信息传送回执
        //let 定义的参数只在 {}内有效
        //const定义的变量不可以修改，而且必须初始化。
        for (let ext in MDN) {
            const expected = MDN[ext];
            const actual = mime.getType(ext);
            if (actual !== expected) 
            {
                //push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
                diffs.push(['MDN', ext, expected, actual])
            };
        }
        for (let ext in mimeTypes.types) {
            const expected = mimeTypes.types[ext];
            const actual = mime.getType(ext);
            if (actual !== expected) 
            {
                diffs.push(['mime-types', ext, expected, actual]);
            }            
        }
    });
    it('types', function() {
        // 常见类型分类
        assert.equal(mime.getType('html'), 'text/html');
        assert.equal(mime.getType('js'), 'application/javascript');
        assert.equal(mime.getType('json'), 'application/json');
        assert.equal(mime.getType('rtf'), 'application/rtf');
        assert.equal(mime.getType('txt'), 'text/plain');
        assert.equal(mime.getType('xml'), 'application/xml');
    });
    it('extensions', function() {
        assert.equal(mime.getExtension('text/html;charset=UTF-8'), 'html');
        assert.equal(mime.getExtension('text/HTML; charset=UTF-8'), 'html');
        assert.equal(mime.getExtension('text/html; charset=UTF-8'), 'html');
        assert.equal(mime.getExtension('text/html; charset=UTF-8 '), 'html');
        assert.equal(mime.getExtension('text/html ; charset=UTF-8'), 'html');
        assert.equal(mime.getExtension(mime._types.text), 'txt');
        assert.equal(mime.getExtension(mime._types.htm), 'html');
        //bin:二进制文件
        assert.equal(mime.getExtension('application/octet-stream'), 'bin');
        assert.equal(mime.getExtension('application/octet-stream '), 'bin');
        assert.equal(mime.getExtension(' text/html; charset=UTF-8'), 'html');
        assert.equal(mime.getExtension('text/html; charset=UTF-8 '), 'html');
        assert.equal(mime.getExtension('text/html; charset=UTF-8'), 'html');
        assert.equal(mime.getExtension('text/html ; charset=UTF-8'), 'html');
        assert.equal(mime.getExtension('text/html;charset=UTF-8'), 'html');
        assert.equal(mime.getExtension('text/Html;charset=UTF-8'), 'html');
        assert.equal(mime.getExtension('unrecognized'), null);
    });
});
