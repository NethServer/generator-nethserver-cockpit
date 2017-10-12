'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.blue('NethServer Cockpit') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'rawname',
      message: 'NethServer Cockpit module name raw (es. nethserver-dummy)',
      default: 'nethserver-dummy'
    }, {
      type: 'input',
      name: 'name',
      message: 'NethServer Cockpit module name (es. NethServer Dummy)',
      default: 'NethServer Dummy'
    }, {
      type: 'confirm',
      name: 'angular',
      message: 'Use AngularJS',
      default: 'Y'
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {

    if (this.props.angular) {

    } else {
      // mkdirs
      mkdirp('app/assets');
      mkdirp('app/scripts');
      mkdirp('app/styles');

      // copy files
      this.fs.copyTpl(
        this.templatePath('app/index.html'),
        this.destinationPath('app/index.html'), {
          rawname: this.props.rawname,
          name: this.props.name
        }
      );

      this.fs.copy(
        this.templatePath('app/assets/icon.png'),
        this.destinationPath('app/assets/icon.png')
      );

      this.fs.copy(
        this.templatePath('app/scripts/app.js'),
        this.destinationPath('app/scripts/app.js')
      );
      this.fs.copy(
        this.templatePath('app/styles/main.css'),
        this.destinationPath('app/styles/main.css')
      );

      this.fs.copy(
        this.templatePath('app/override.json'),
        this.destinationPath('app/override.json')
      );
      this.fs.copyTpl(
        this.templatePath('app/manifest.json'),
        this.destinationPath('app/manifest.json'), {
          rawname: this.props.rawname
        }
      );

      mkdirp('root/usr/share/cockpit/nethserver/applications');
      this.fs.copyTpl(
        this.templatePath('root/usr/share/cockpit/nethserver/applications/nethserver-template.json'),
        this.destinationPath('root/usr/share/cockpit/nethserver/applications/' + this.props.rawname + '.json'), {
          rawname: this.props.rawname,
          name: this.props.name
        }
      );

      this.fs.copy(
        this.templatePath('.gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copyTpl(
        this.templatePath('createlinks'),
        this.destinationPath('createlinks'), {
          rawname: this.props.rawname
        }
      );
      this.fs.copyTpl(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js'), {
          rawname: this.props.rawname
        }
      );
      this.fs.copyTpl(
        this.templatePath('nethserver-template.spec'),
        this.destinationPath(this.props.rawname + '.spec'), {
          rawname: this.props.rawname,
          name: this.props.name
        }
      );
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('package.json'), {
          rawname: this.props.rawname,
          name: this.props.name
        }
      );
      this.fs.copy(
        this.templatePath('prep-sources'),
        this.destinationPath('prep-sources')
      );
    }
  }

  install() {
    this.installDependencies();
  }
};
