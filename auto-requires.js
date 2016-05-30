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

  const list = getList();

  list.forEach((v) => {
    const f = v.replace(/\_/g, '/');
    const file = `${this.options.root}/${f}`;
    if (this.options.jointype == 'object') {
      const s = v.split('_');
      _.set(this.modules, s, require(file));
     } else {
      this.modules[v] = require(file);
     }
  });

  function set (path, isNest) {
    const flist = fs.readdirSync(path);
    let key = null;
    if (isNest) key = path.replace(self.options.root, '').replace(/^\//g,'');
    key = path.replace(self.options.root, '').replace(/^\//g,'');

    flist.forEach((f) => {
      if (isDir(f)) set(`${path}/${f}`, true);
      setFileList(f, key);
    });
  }

  function setFileList(path, dir) {
    if (!path.match(/.*\.js$/)) return;
    let key = getVarName(path);
    if (dir !== null) key = `${dir}_${key}`;
    self.filelist.push(key);
  }

  function getList () {
    return self.filelist;
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
