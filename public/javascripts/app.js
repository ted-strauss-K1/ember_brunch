(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("app", function(exports, require, module) {
  module.exports = Ember.Application.create({
    LOG_TRANSITIONS: true
  });
  
});
window.require.register("controllers/CubeController", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.CubeController = Ember.ObjectController.extend({
    isEditing: false,
    doneEditing: function() {
      this.set('isEditing', false);
      this.get("store").commit();
      return this.get("target.router").transitionTo("cubes.index");
    },
    edit: function() {
      return this.set('isEditing', true);
    }
  });
  
});
window.require.register("controllers/OrderController", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.OrdersIndexController = Em.ArrayController.extend();
  
});
window.require.register("controllers/PostController", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.PostsIndexController = Em.ArrayController.extend();

  module.exports = App.PostController = Ember.ObjectController.extend({
    isEditing: false,
    doneEditing: function() {
      this.set('isEditing', false);
      this.get("store").commit();
      return this.get("target.router").transitionTo("posts.index");
    },
    edit: function() {
      return this.set('isEditing', true);
    }
  });
  
});
window.require.register("fixtures/posts", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.Post.FIXTURES = [
    {
      id: 1,
      title: 'Da Book',
      author: 'John Doe',
      publishedAt: new Date('2011-05-11'),
      intro: 'Lorem ipsum dolor sit amet, consectetur...',
      extended: 'Lorem **ipsum** *dolor* sit amet, [consectetur adipisicing elit](#). Dolorum sequi officia in praesentium provident dolore quo placeat et. Soluta `assumenda` modi quasi numquam sequi necessitatibus suscipit debitis earum quas nostrum.'
    }, {
      id: 2,
      title: 'My Other Book',
      author: 'Mike Roach',
      publishedAt: new Date('2013-03-17'),
      intro: 'Other ipsum dolor sit amet, consectetur...',
      extended: 'Other **ipsum** *dolor* sit amet, [consectetur adipisicing elit](#). Dolorum sequi officia in praesentium provident dolore quo placeat et. Soluta `assumenda` modi quasi numquam sequi necessitatibus suscipit debitis earum quas nostrum.'
    }
  ];
  
});
window.require.register("helpers/date", function(exports, require, module) {
  module.exports = Ember.Handlebars.registerBoundHelper('date', function(date) {
    return moment(date).fromNow();
  });
  
});
window.require.register("helpers/markdown", function(exports, require, module) {
  var showdown;

  showdown = new Showdown.converter();

  module.exports = Ember.Handlebars.registerBoundHelper('markdown', function(input) {
    return new Ember.Handlebars.SafeString(showdown.makeHtml(input));
  });
  
});
window.require.register("initialize", function(exports, require, module) {
  var App;

  App = require('app');

  App.Router.map(function() {
    this.resource('about');
    this.resource('posts', function() {
      return this.resource('post', {
        path: ':post_id'
      });
    });
    this.resource('cubes', function() {
      return this.resource('cube', {
        path: ':cube_id'
      });
    });
    return this.resource('orders', function() {
      return this.resource('order', {
        path: '/:order_id'
      });
    });
  });

  require('routes/IndexRoute');

  require('routes/PostsRoute');

  require('routes/CubesRoute');

  require('routes/OrdersRoute');

  require('models/Cube');

  require('models/Post');

  require('models/Order');

  App.Adapter = DS.RESTAdapter.extend({
    serializer: DS.RESTSerializer.extend({
      primaryKey: function(type) {
        return "id";
      }
    })
  });

  DS.RESTAdapter.reopen({
    url: 'http://localhost:3000'
  });

  App.Store = DS.Store.extend({
    revision: 12,
    adapter: App.Adapter
  });

  /* 2
  App.Store = DS.Store.extend
      revision: 12
  App.Adapter = DS.RESTAdapter.extend
    url: 'http://localhost:3000'
  DS.RESTAdapter.reopen({url: 'http://localhost:3000'});
  */


  require('fixtures/posts');

  require('controllers/PostController');

  require('controllers/CubeController');

  require('controllers/OrderController');

  require('helpers/date');

  require('helpers/markdown');

  require('templates/about');

  require('templates/posts');

  require('templates/posts/index');

  require('templates/post');

  require('templates/post/_edit');

  require('templates/cubes');

  require('templates/cubes/index');

  require('templates/cube');

  require('templates/cube/_edit');

  require('templates/orders');

  require('templates/orders/index');

  require('templates/orders/cubes');

  require('templates/order');

  require('templates/order/_edit');

  require('templates/application');
  
});
window.require.register("models/Cube", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.Cube = DS.Model.extend({
    cube_id: DS.attr('string'),
    camera: DS.attr('string'),
    year: DS.attr('date'),
    cube_number: DS.attr('number'),
    image_type: DS.attr('string'),
    gradient: DS.attr('number'),
    order: DS.belongsTo("App.Order"),
    employee: DS.attr('number'),
    comment: DS.attr('string'),
    retake: DS.attr('boolean'),
    retake_id: DS.attr('string'),
    author: DS.attr('string'),
    created: DS.attr('date'),
    meters: DS.attr('number'),
    m1_hole: DS.attr('string'),
    m1_project: DS.attr('string'),
    m1_from: DS.attr('number'),
    m1_to: DS.attr('number'),
    m1_unit: DS.attr('string'),
    m2_hole: DS.attr('string'),
    m2_project: DS.attr('string'),
    m2_from: DS.attr('number'),
    m2_to: DS.attr('number'),
    m2_unit: DS.attr('string')
  });
  
});
window.require.register("models/Meter", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.Meter = DS.Model.extend({
    hole: DS.attr('string'),
    project: DS.attr('string'),
    from: DS.attr('number'),
    to: DS.attr('number')
  });
  
});
window.require.register("models/Order", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.Order = DS.Model.extend({
    name: DS.attr('string'),
    orderid: DS.attr('number'),
    created: DS.attr('date'),
    starting: DS.attr('date'),
    camera: DS.attr('number'),
    trailer: DS.attr('number'),
    client_id: DS.attr('string'),
    author: DS.attr('string'),
    site: DS.attr('number'),
    status: DS.attr('boolean'),
    unit: DS.attr('string'),
    active: DS.attr('string'),
    cubes: DS.hasMany("App.Cube")
  });
  
});
window.require.register("models/Post", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.Post = DS.Model.extend({
    title: DS.attr('string'),
    author: DS.attr('string'),
    intro: DS.attr('string'),
    extended: DS.attr('string'),
    publishedAt: DS.attr('date')
  });
  
});
window.require.register("routes/CubesRoute", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.CubesRoute = Em.Route.extend({
    model: function() {
      return App.Cube.find();
    }
  });
  
});
window.require.register("routes/IndexRoute", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.IndexRoute = Ember.Route.extend({
    redirect: function() {
      return this.transitionTo('posts');
    }
  });
  
});
window.require.register("routes/MetersRoute", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.MetersRoute = Em.Route.extend({
    model: function() {
      return App.Meter.find();
    }
  });
  
});
window.require.register("routes/OrdersRoute", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.OrdersIndexRoute = Em.Route.extend({
    model: function() {
      return App.Order.find();
    }
  });
  
});
window.require.register("routes/PostsRoute", function(exports, require, module) {
  var App;

  App = require('app');

  module.exports = App.PostsRoute = Em.Route.extend({
    model: function() {
      return App.Post.find();
    }
  });
  
});
window.require.register("templates/about", function(exports, require, module) {
  Ember.TEMPLATES['about'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    


    data.buffer.push("<div class=\"container\">\n    <div class=\"row\">\n        <div class=\"span12\">\n            <h4>About</h4>\n            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla maxime rem non autem labore sint placeat. Non voluptas ipsam ut natus earum quisquam perferendis culpa architecto accusamus illo laboriosam rerum!. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus tempora accusamus nostrum quis facilis facere reprehenderit perspiciatis ea alias odio libero maiores eveniet ut sapiente eligendi maxime iure impedit unde.</p>\n\n            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla maxime rem non autem labore sint placeat. Non voluptas ipsam ut natus earum quisquam perferendis culpa architecto accusamus illo laboriosam rerum!. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus tempora accusamus nostrum quis facilis facere reprehenderit perspiciatis ea alias odio libero maiores eveniet ut sapiente eligendi maxime iure impedit unde.</p>\n\n            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla maxime rem non autem labore sint placeat. Non voluptas ipsam ut natus earum quisquam perferendis culpa architecto accusamus illo laboriosam rerum!. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus tempora accusamus nostrum quis facilis facere reprehenderit perspiciatis ea alias odio libero maiores eveniet ut sapiente eligendi maxime iure impedit unde.</p>\n        </div>\n    </div>\n</div>");
    
  });
});
window.require.register("templates/application", function(exports, require, module) {
  Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, stack2, hashContexts, hashTypes, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("Webby");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("Orders");
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("Cubes");
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("Posts");
    }

  function program9(depth0,data) {
    
    
    data.buffer.push("About");
    }

  function program11(depth0,data) {
    
    var buffer = '', hashTypes, hashContexts;
    data.buffer.push("\r\n    <li>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "item", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\r\n  ");
    return buffer;
    }

    data.buffer.push("<div class=\"container\">\r\n    <div class=\"navbar\">\r\n        <div class=\"navbar-inner\">\r\n            ");
    hashContexts = {'class': depth0};
    hashTypes = {'class': "STRING"};
    options = {hash:{
      'class': ("brand")
    },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "index", options) : helperMissing.call(depth0, "linkTo", "index", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("\r\n            <ul class=\"nav\">\r\n                <li>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "orders", options) : helperMissing.call(depth0, "linkTo", "orders", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</li>\r\n                <li>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "cubes", options) : helperMissing.call(depth0, "linkTo", "cubes", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</li>\r\n                <li>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "posts", options) : helperMissing.call(depth0, "linkTo", "posts", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</li>\r\n                <li>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "about", options) : helperMissing.call(depth0, "linkTo", "about", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div>\r\n	");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("\r\n</div>\r\n<ul>\r\n  ");
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers.each.call(depth0, "item", "in", "content", {hash:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("\r\n</ul>");
    return buffer;
    
  });
});
window.require.register("templates/cube", function(exports, require, module) {
  Ember.TEMPLATES['cube'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, stack2, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, hashTypes, hashContexts, options;
    data.buffer.push("\n    ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial),stack1 ? stack1.call(depth0, "post/edit", options) : helperMissing.call(depth0, "partial", "post/edit", options))));
    data.buffer.push("\n    <button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</button>\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', hashTypes, hashContexts;
    data.buffer.push("\n    <button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Edit</button>\n");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '', hashTypes, hashContexts;
    data.buffer.push("\nmeter #1\n<ul>\n<li>hole ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "m1_hole", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>project ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "m1_project", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>from ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "m1_from", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>to ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "m1_to", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>unit ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "m1_unit", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n</ul>\n");
    return buffer;
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("\nThis cube has no meters.\n");
    }

  function program9(depth0,data) {
    
    var buffer = '', hashTypes, hashContexts;
    data.buffer.push("\nmeter #2\n<ul>\n<li>hole ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "m2_hole", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>project ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "m2_project", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>from ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "m2_from", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>to ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "m2_to", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>unit ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "m2_unit", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n</ul>\n");
    return buffer;
    }

    hashTypes = {};
    hashContexts = {};
    stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<h3>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "cube_id", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</h3>\n<hr>\n<ul>\n<div class=\"below-the-fold\">\n<li>camera ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "camera", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>created ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, "created", options) : helperMissing.call(depth0, "date", "created", options))));
    data.buffer.push("</li>\n<li>type ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "image_type", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>order ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "order", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>author ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "author", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>comment ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "comment", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>meters ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "meters", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n");
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers['if'].call(depth0, "m1_hole", {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("\n");
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers['if'].call(depth0, "m2_hole", {hash:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("\n</ul>\n</div>");
    return buffer;
    
  });
});
window.require.register("templates/cube/_edit", function(exports, require, module) {
  Ember.TEMPLATES['cube/_edit'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


    data.buffer.push("<p>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextField", {hash:{
      'valueBinding': ("title")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</p>\r\n<p>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
      'valueBinding': ("intro")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</p>\r\n<p>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
      'valueBinding': ("extended")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</p>");
    return buffer;
    
  });
});
window.require.register("templates/cubes", function(exports, require, module) {
  Ember.TEMPLATES['cubes'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
    data.buffer.push("\n                    ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "cube", "", options) : helperMissing.call(depth0, "linkTo", "cube", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("\n                ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1, hashTypes, hashContexts, options;
    data.buffer.push("<li>\n                        ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "cube_number", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" <small class=\"text-success\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "image_type", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</small> <small class=\"muted\"> ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, "created", options) : helperMissing.call(depth0, "date", "created", options))));
    data.buffer.push("</small>\n                    </li>");
    return buffer;
    }

    data.buffer.push("<div class=\"container\">\n    <div class=\"row\">\n        <div class=\"span3\">\n            <h4>Cubes</h4>\n            <ul class=\"unstyled\">\n                ");
    hashTypes = {};
    hashContexts = {};
    stack1 = helpers.each.call(depth0, "model", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            </ul>\n        </div>\n        <div class=\"span8\">\n            ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("\n        </div>\n    </div>\n</div>");
    return buffer;
    
  });
});
window.require.register("templates/cubes/index", function(exports, require, module) {
  Ember.TEMPLATES['cubes/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    


    data.buffer.push("<p class=\"text-warning\">Please select a post</p>");
    
  });
});
window.require.register("templates/index", function(exports, require, module) {
  Ember.TEMPLATES['index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '';


    return buffer;
    
  });
});
window.require.register("templates/order", function(exports, require, module) {
  Ember.TEMPLATES['order'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, hashTypes, hashContexts, options;
    data.buffer.push("\n    ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial),stack1 ? stack1.call(depth0, "post/edit", options) : helperMissing.call(depth0, "partial", "post/edit", options))));
    data.buffer.push("\n    <button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</button>\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', hashTypes, hashContexts;
    data.buffer.push("\n    <button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Edit</button>\n");
    return buffer;
    }

    hashTypes = {};
    hashContexts = {};
    stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<h3>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "order_id", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</h3>\n<hr>\n<ul>\n<div class=\"below-the-fold\">\n<li>camera ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>created by ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "author", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</li>\n<li>created ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, "created", options) : helperMissing.call(depth0, "date", "created", options))));
    data.buffer.push("</li>\n</ul>\n</div>");
    return buffer;
    
  });
});
window.require.register("templates/order/_edit", function(exports, require, module) {
  Ember.TEMPLATES['order/_edit'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


    data.buffer.push("<p>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextField", {hash:{
      'valueBinding': ("title")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</p>\r\n<p>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
      'valueBinding': ("intro")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</p>\r\n<p>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
      'valueBinding': ("extended")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</p>");
    return buffer;
    
  });
});
window.require.register("templates/orders", function(exports, require, module) {
  Ember.TEMPLATES['orders'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
    data.buffer.push("\n                    ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "orders", "", options) : helperMissing.call(depth0, "linkTo", "orders", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("\n                ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1, hashTypes, hashContexts, options;
    data.buffer.push("<li>\n                        ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" <small class=\"text-success\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "camera", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</small> <small class=\"muted\"> ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, "created", options) : helperMissing.call(depth0, "date", "created", options))));
    data.buffer.push("</small>\n                    </li>");
    return buffer;
    }

    data.buffer.push("<div class=\"container\">\n    <div class=\"row\">\n        <div class=\"span3\">\n            <h4>Some Orders</h4>\n            <ul class=\"unstyled\">\n                ");
    hashTypes = {};
    hashContexts = {};
    stack1 = helpers.each.call(depth0, "model", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            </ul>\n        </div>\n        <div class=\"span8\">\n            ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("\n        </div>\n    </div>\n</div>");
    return buffer;
    
  });
});
window.require.register("templates/orders/cubes", function(exports, require, module) {
  Ember.TEMPLATES['orders/cubes'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
    data.buffer.push("\n                    ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "cube", "", options) : helperMissing.call(depth0, "linkTo", "cube", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("\n                ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1, hashTypes, hashContexts, options;
    data.buffer.push("<li>\n                        ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "cube_number", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" <small class=\"text-success\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "image_type", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</small> <small class=\"muted\"> ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, "created", options) : helperMissing.call(depth0, "date", "created", options))));
    data.buffer.push("</small>\n                    </li>");
    return buffer;
    }

    data.buffer.push("<div class=\"container\">\n    <div class=\"row\">\n        <div class=\"span3\">\n            <h4>Cubes</h4>\n            <ul class=\"unstyled\">\n                ");
    hashTypes = {};
    hashContexts = {};
    stack1 = helpers.each.call(depth0, "model", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            </ul>\n        </div>\n        <div class=\"span8\">\n            ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("\n        </div>\n    </div>\n</div>");
    return buffer;
    
  });
});
window.require.register("templates/orders/index", function(exports, require, module) {
  Ember.TEMPLATES['orders/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    


    data.buffer.push("<p class=\"text-warning\">Choose an order.</p>");
    
  });
});
window.require.register("templates/post", function(exports, require, module) {
  Ember.TEMPLATES['post'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, hashTypes, hashContexts, options;
    data.buffer.push("\n    ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial),stack1 ? stack1.call(depth0, "post/edit", options) : helperMissing.call(depth0, "partial", "post/edit", options))));
    data.buffer.push("\n    <button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</button>\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', hashTypes, hashContexts;
    data.buffer.push("\n    <button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Edit</button>\n");
    return buffer;
    }

    hashTypes = {};
    hashContexts = {};
    stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<h1>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</h1>\n<h3>by ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "author", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" <small class=\"muted\">(");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, "publishedAt", options) : helperMissing.call(depth0, "date", "publishedAt", options))));
    data.buffer.push(")</small></h3>\n\n<hr>\n\n<div class=\"intro\">\n    ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.markdown),stack1 ? stack1.call(depth0, "intro", options) : helperMissing.call(depth0, "markdown", "intro", options))));
    data.buffer.push("\n</div>\n\n<div class=\"below-the-fold\">\n    ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.markdown),stack1 ? stack1.call(depth0, "extended", options) : helperMissing.call(depth0, "markdown", "extended", options))));
    data.buffer.push("\n</div>");
    return buffer;
    
  });
});
window.require.register("templates/post/_edit", function(exports, require, module) {
  Ember.TEMPLATES['post/_edit'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


    data.buffer.push("<p>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextField", {hash:{
      'valueBinding': ("title")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</p>\r\n<p>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
      'valueBinding': ("intro")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</p>\r\n<p>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextArea", {hash:{
      'valueBinding': ("extended")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</p>");
    return buffer;
    
  });
});
window.require.register("templates/posts", function(exports, require, module) {
  Ember.TEMPLATES['posts'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
    data.buffer.push("\n                    ");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "post", "", options) : helperMissing.call(depth0, "linkTo", "post", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("\n                ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', hashTypes, hashContexts;
    data.buffer.push("<li>\n                        ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" <small class=\"muted\">by ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "author", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</small>\n                    </li>");
    return buffer;
    }

    data.buffer.push("<div class=\"container\">\n    <div class=\"row\">\n        <div class=\"span3\">\n            <h4>Recent Posts</h4>\n            <ul class=\"unstyled\">\n                ");
    hashTypes = {};
    hashContexts = {};
    stack1 = helpers.each.call(depth0, "model", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            </ul>\n        </div>\n        <div class=\"span8\">\n            ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("\n        </div>\n    </div>\n</div>");
    return buffer;
    
  });
});
window.require.register("templates/posts/index", function(exports, require, module) {
  Ember.TEMPLATES['posts/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    


    data.buffer.push("<p class=\"text-warning\">Please select a post</p>");
    
  });
});
