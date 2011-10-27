var ContactsView = Backbone.View.extend({
  el: '#contacts',
  events: {
    'click #new_contact': 'create',
    'click #edit_contact': 'edit',
    'click #delete_contact': 'remove'
  },
  initialize: function() {
    // when the collection changes we want to update the view
    this.collection.bind('reset', this.render, this);
    this.collection.bind('add', this.render, this);
    this.collection.bind('remove', this.render, this);
    this.collection.bind('change', this.render, this);
    this.$('#new_contact').prop('disabled', false);
  },
  render: function() {
    var template = $('script#contacts_view').html(),
        el = this.$('ol').empty();
    this.collection.each(function(contact) {
      $(_.template(template, contact.toJSON()))
        .toggleClass('selected', this.selected === contact)
        .click(_.bind(this.selectContact, this, contact, true))
        .appendTo(el);
    }, this);
    return this;
  },
  select: function(contact) {
    this.selected = this.collection.get(contact && contact.id);
    this.render();
    this.$('#edit_contact, #delete_contact').prop('disabled', !this.selected);
  },
  selectContact: function(contact) {
    this.select(contact);
    app.navigate(contact && contact.id, true);
  },
  create: function() {
    app.navigate('new', true);
    return false;
  },
  edit: function() {
    if (this.selected)
      app.navigate(this.selected.id + '/edit', true);
    return false;
  },
  remove: function() {
    if (this.selected && confirm("Are you sure you want to remove '" + this.selected.fullName() + "'?")) {
      // the collection will trigger a reset event thus call our render
      this.selected.destroy();
      app.navigate('', true);
    }
    return false;
  }
});

var ContactView = Backbone.View.extend({
  className: 'contact',
  initialize: function() {
    this.model.bind('change', this.render, this);
  },
  render: function() {
    var template = $('script#contact_view').html();
    $(this.el).html(_.template(template, this.model.toJSON()));
    return this;
  }
});

var ContactFormView = Backbone.View.extend({
  tagName: 'form',
  className: 'contact',
  attributes: {
    method: 'post'
  },
  events: {
    'submit': 'save'
  },
  initialize: function() {
    this.model.bind('change', this.render, this);
  },
  render: function() {
    var template = $('script#contact_form_view').html();
    $(this.el).html(template);
    _.each(this.model.attributes, function(value, attr) {
      this.$(':input[name=' + attr + ']').val(value);
    }, this);
    return this;
  },
  save: function(event) {
    event.preventDefault();
    
    this.$('span.error').remove();
    
    var model = this.model, collection = this.collection;
    var attributes = _.reduce(this.el, function(attrs, input) {
      if (input.name)
        attrs[input.name] = input.value;
      return attrs;
    }, {});
    
    model.save(attributes, {
      error: _.bind(this.showErrors, this),
      success: function() {
        if (!model.collection)
          collection.add(model);
        app.navigate(model.id + '', true);
      }
    });
  },
  showErrors: function(model, error) {
    _.each(error, function(msg, attr) {
      var input = this.$(':input[name=' + attr + ']')
        .after($('<span class="error" />').text(msg));
    }, this);
  }
});