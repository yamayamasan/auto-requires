'use strict';
var autorequire = require('../auto-requires');
var expect = require('chai').expect;

describe("Test", function () {
  it ("load only ctrl dir", function () {
    var mods = autorequire({
      root: __dirname + '/app',
      path: 'ctrl'
    }).mods;

    var ctrlindex = mods.ctrl_index.index();
    expect(mods).to.have.all.keys('ctrl_index', 'ctrl_user');
    expect(ctrlindex).to.equal('ctrl.index.index');
  });

  it ("load ctrl,model,lib dirs", function () {
    var multi = autorequire({
      root: __dirname + '/app',
      path: ['ctrl', 'model', 'lib'],
    }).mods;

    var ctrlindex = multi.ctrl_index.index();
    expect(multi).to.have.all.keys('ctrl_index', 'ctrl_user', 'model_index', 'lib_index');
    expect(ctrlindex).to.equal('ctrl.index.index');
  });

  it ("load jointype is object", function () {
    var multi = autorequire({
      root: __dirname + '/app',
      path: ['ctrl'],
      jointype: 'object'
    }).mods.ctrl;

    var ctrlindex = multi.index.index();
    expect(multi).to.have.all.keys('index', 'user');
    expect(ctrlindex).to.equal('ctrl.index.index');
  });
});
