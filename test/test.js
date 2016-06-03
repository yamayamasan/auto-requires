'use strict';
var autorequire = require('../auto-requires');
var expect = require('chai').expect;

describe("Test", function () {
  it ("load only ctrl dir", function () {
    var mods = autorequire({
      root: __dirname + '/app',
      path: 'ctrl'
    });

    var ctrlindex = mods.ctrl_index.index();
    expect(mods).to.have.all.keys('ctrl_index', 'ctrl_user', 'ctrl_data_list');
    expect(ctrlindex).to.equal('ctrl.index.index');
  });

  it ("load ctrl,model,lib dirs", function () {
    var multi = autorequire({
      root: __dirname + '/app',
      path: ['ctrl', 'model', 'lib'],
    });

    var ctrlindex = multi.ctrl_index.index();
    expect(multi).to.have.all.keys('ctrl_index', 'ctrl_user', 'model_index', 'lib_index', 'ctrl_data_list');
    expect(ctrlindex).to.equal('ctrl.index.index');
  });

  it ("load jointype is object", function () {
    var multi = autorequire({
      root: __dirname + '/app',
      path: ['ctrl'],
      jointype: 'object'
    }).ctrl;

    var ctrlindex = multi.index.index();
    expect(multi).to.have.all.keys('index', 'user', 'data_list');
    expect(ctrlindex).to.equal('ctrl.index.index');
  });

  it ("require params", function () {
    try {
      var nonRoot = autorequire({
        path: ['ctrl'],
        jointype: 'object'
      });
    } catch (e) {
      expect(e).to.eql(new Error());
    }

    try {
      var nonPath = autorequire({
        root: __dirname + '/app',
        jointype: 'object'
      });
    } catch(e) {
      expect(e).to.eql(new Error());
    }
  });

  it ("test nest", function () {
    var multi = autorequire({
      root: __dirname + '/app',
      path: ['ctrl'],
      jointype: 'object',
      isNest: true
    }).ctrl;

    var ctrlindex = multi.index.index();
    expect(multi).to.have.all.keys('index', 'user', 'data_list', 'admin', 'sub');
    expect(ctrlindex).to.equal('ctrl.index.index');
  });
});
