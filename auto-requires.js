'use strict';

const util = require('util');
const fs = require('fs');
const _ = require('lodash');

const AutoRequires = function (options) {
  if (!(this instanceof AutoRequires)) {
    return new AutoRequires(options);
  }

  if (!options.root || !options.path) throw new Error('Required args [root, path]');

  const self = this;

  if (util.isString(options.path)) options.path = [options.path];
  this.modules = {};
  this.filelist = [];
  this.dirs = [];
  this.options = _.merge({
    root: '',
    path: '',
    jointype: 'under',
    isNest: false
  }, options);

  this.options.path.forEach((v) => {
    set(`${options.root}/${v}`);
  });

  function set (path, isNest) {
    const flist = fs.readdirSync(path);
    let key = null;
    if (isNest) key = path.replace(self.options.root, '').replace(/^\//g,'');
    key = path.replace(self.options.root, '').replace(/^\//g,'');

    flist.forEach((f) => {
      if (isDir(f)) set(`${path}/${f}`, true);
      setModule(f, key);
    });
  }

  function setModule(path, dir) {
    if (!path.match(/.*\.js$/)) return;
    let key = getVarName(path);

    const file = `${self.options.root}/${dir}/${key}`;
    if (self.options.jointype == 'object') {
      _.set(self.modules, [dir, key], require(file));
     } else {
      key = `${dir}_${key}`;
      self.modules[key] = require(file);
     }
  }

  function getVarName (f) {
    return f.replace(/\.js$/g, '');
  }

  function isDir (path) {
    return fs.existsSync(path) && fs.statSync(path).isDirectory();
  }

  return this.modules;
};

module.exports = AutoRequires;
