const Generator = require('yeoman-generator')
module.exports = class extends Generator{
    prompting() {
        return this.prompt([{
            type: 'input',
            name: 'name',
            message: 'you project name',
            default: this.appname //为项目生成目录名称
        }, {
            type: 'input',
            name: 'keys',
            message: 'you project keys',
            default: ""
        }]).then((ans) => {
            // ans：{name: 'use input value'}
            console.log(ans, 888888)
            this.ans = ans
        })
    }
    writing() {
        let tmpl = [
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