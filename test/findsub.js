require('chai').should();
var path = require('path');
var fs = require('fs');
var findSubModule = require('../lib/runtime/subModule/find');

describe('File tree walker', function () {
    describe('getDataFrom：get data- from puzzle', function () {
        it('<puzzle data-a="tes a" data-b=1 data-c=true><\/puzzle>:', function () {
            findSubModule.getDataFrom('<puzzle data-a="tes a" data-b="1" data-c="true"><\/puzzle>').should.eql({
                a: "tes a",
                b: "1",
                c: "true"
            });
        });
        it('<puzzle data-a="1" data-b=1 style="color:red" data-c=true onclick=""><\/puzzle>:', function () {
            findSubModule.getDataFrom('<puzzle data-a="1" data-b="1" style="color:red" data-c="true" onclick=""><\/puzzle>').should.eql({
                a: "1",
                b: "1",
                c: "true"
            });
        });
        it('<puzzle data-a="1" data-b="" data-c data-d=><\/puzzle>:', function () {
            findSubModule.getDataFrom('<puzzle data-a="1" data-b="" data-c data-d=><\/puzzle>').should.eql({
                a: "1",
                b: ""
            });
        });
        it('<puzzle data-a="1"  data-=""  data-h="df" data-b="1"   data-g= style="color:red" data-c="true"><\/puzzle>:', function () {
            findSubModule.getDataFrom('<puzzle data-a="1"  data-=""  data-h="df" data-b="1"   data-g= style="color:red" data-c="true"><\/puzzle>').should.eql({
                a: "1",
                b: "1",
                h: "df",
                c: "true"
            });
        });
        it('属性字符串是单引号：<puzzle data-a=\'1\'></puzzle>:', function () {
            findSubModule.getDataFrom('<puzzle data-a=\'1\'></puzzle>').should.eql({
                a: "1"
            });
        });
        it('属性中含有单引号：<puzzle data-a="\'1\'23"></puzzle>:', function () {
            findSubModule.getDataFrom('<puzzle data-a="\'1\'23"></puzzle>').should.eql({
                a: "\'1\'23"
            });
        });
        it('含有转义字符的字符串：<puzzle data-a="\"1\"23"></puzzle>:', function () {
            findSubModule.getDataFrom('<puzzle data-a="\"1\"23"></puzzle>').should.eql({
                a: "\"1\"23"
            });
        });
        it('属性值是数字：<puzzle data-a=34></puzzle>:', function () {
            findSubModule.getDataFrom('<puzzle data-a=34></puzzle>').should.eql({
                a: "34"
            });
        });
        it('属性值是布尔型：<puzzle data-a=true></puzzle>:', function () {
            findSubModule.getDataFrom('<puzzle data-a=true></puzzle>').should.eql({
                a: "true"
            });
        });
    });

    describe('walk the file tree', function () {
        var code = fs.readFileSync(path.resolve(__dirname, './project/index.html'), 'utf-8').toString();
        it('when walk through index.html, all submodules should be found and order by priority:', function () {
            findSubModule.in(code).should.eql([
                {
                    module: './content',
                    priority: "2",
                    puz: '<puzzle data-module="./content" data-priority="2"></puzzle>'
                },
                {
                    module: './foot',
                    priority: "1",
                    new: "false",
                    async: "true",
                    puz: '<puzzle data-module="./foot" data-priority="1" data-new="false" data-async="true"></puzzle>'
                },
                {
                    "module": "./bottom",
                    "priority": "1",
                    "new": "false",
                    "async": "true",
                    "puz": "<puzzle data-module=\"./bottom\" data-priority=\"1\" data-new=\"false\" data-async=\"true\"></puzzle>"
                },
                {
                    module: './nav',
                    new: "true",
                    puz: '<puzzle data-module="./nav" data-new="true"></puzzle>'
                }
            ]);
        });
        it('when walk through the code has no puzzle ,return a []:', function () {
            findSubModule.in('<body>when walk through the code has no puzzle ,return a </body>').should.eql([]);
        });
    });
});
