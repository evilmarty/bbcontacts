var app;

(function() {
  var name = 'contacts',
      store = localStorage.getItem(name),
      data = (store && JSON.parse(store)) || {},
      saveData = function() {
        localStorage.setItem(name, JSON.stringify(data));
      }
  
  Backbone.sync = function(method, model, options) {
    var resp;

    switch (method) {
      case "read":
        if (model.id)
          resp = data[model.id];
        else
          resp = _.map(data, function(attr, id) {
            attr.id = id;
            return attr;
          });
        break;
      case "create":
        model.id = new Date().getTime();
      case "update":
        resp = data[model.id] = model.toJSON();
        saveData();
        break;
      case "delete":
        resp = data[model.id];
        delete data[model.id];
        saveData();
        break;
    }

    if (resp)
      options.success(resp);
    else
      options.error("Record not found");
  }
})();

$(function() {
  app = new ContactsController;
  Backbone.history.start();
});
