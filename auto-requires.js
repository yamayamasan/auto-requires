'use strict';

const util = require('util');
const fs = require('fs');
const _ = require('lodash');

const AutoRequires = function (options) {
  if (!(this instanceof AutoRequires)) {
    return new AutoRequires(options);
  }

  if (!options.root || !options.path) {
    throw new Error('Required args [root, path]');
  }

  if (util.isString(options.path)) options.path = [options.path];
  this.modules = {};
  this.filelist = [];
  this.dirs = [];
  this.options = Object.assign({
    root: '',
    path: '',
    jointype: 'under',
    isNest: false
  }, options);

  const self = this;

  self.options.path.forEach((v) => {
    set(`${options.root}/${v}`);
  });

  function set (path) {
    const flist = fs.readdirSync(path);
    const key = path.replace(self.options.root, '').replace(/^\//g,'');

    flist.forEach((f) => {
      const pf = `${path}/${f}`;
      if (self.options.isNest && isDir(pf)) set(pf);
      setModule(f, key);
    });
  }

  function setModule(path, dir) {
    if (!path.match(/.*\.js$/)) return;
    let key = getVarName(path);

    const file = `${self.options.root}/${dir}/${key}`;
    if (self.options.jointype == 'object') {
      const targetArr = dir.split('/');
      targetArr.push(key);
      _.set(self.modules, targetArr, require(file));
    } else {
      dir = dir.replace('/', '_');
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

  return self.modules;
};

module.exports = AutoRequires;
