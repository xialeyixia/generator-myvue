const Generator = require('yeoman-generator')
module.exports = class extends Generator{
    prompting() {
        return this.prompt({
            type: 'input',
            name: 'name',
            message: 'you project name',
            default: this.appname //为项目生成目录名称
        }).then((ans) => {
            // ans：{name: 'use input value'}
            this.ans = ans
        })
    }
    writing() {
        let tmpl = [
            'package.json',
            'index.html',
            'server.js' 
        ]
        tmpl.forEach((item) => {
            this.fs.copyTpl(
                this.templatePath(item),
                this.destinationPath(item),
                this.ans
            )
        })
    }
    
}