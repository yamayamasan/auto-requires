'use strict';

const util = require('util');
const fs = require('fs');
const _ = require('lodash');

const AutoRequire = function (options) {
  if (!(this instanceof AutoRequire)) {
    return new AutoRequire(options);
  }

  const self = this;

  this.mods = {};
  this.options = options || {
    root: '',
    path: 'ctrl',
    jointype: 'under',
    isNest: false
  };


  this.filelist = [];
  this.dirs = [];
  if (util.isString(this.options.path)) this.options.path = [this.options.path];
  this.options.path.forEach((v) => {
    let path = `${options.root}/${v}`;
    set(path);
  });
  const list = getList();

  let modmod = {};
  list.forEach((v) => {
    const f = v.replace(/\_/g, '/');
    const file = `${this.options.root}/${f}`;
    if (this.options.jointype == 'object') {
      const s = v.split('_');
      _.set(this.mods, s, require(file));
     } else {
      this.mods[v] = require(file);
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

  function join(path, dir) {
    let o = {};
    o[dir] = path;
    return o;
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
};

module.exports = AutoRequire;
