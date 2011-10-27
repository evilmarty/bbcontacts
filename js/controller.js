var ContactsController = Backbone.Router.extend({
  routes: {
    '': 'index',
    'new': 'new',
    ':id/edit': 'edit',
    ':id': 'show'
  },
  initialize: function() {
    this.contactEl = $('#contact');
    this.emptyContactContent = this.contactEl.html();
    
    this.contact = null;
    this.contacts = new Contacts;
    this.contactsView = new ContactsView({
      collection: this.contacts
    });
    
    this.bind('all', function() {
      this.contactsView.select(this.contact);
    });
    
    this.contacts.fetch();
  },
  index: function() {
    this.contact = null;
    this.contactEl.html(this.emptyContactContent);
  },
  show: function(id) {
    this.contact = this.contacts.get(id);
    var view = new ContactView({model: this.contact});
    this.contactEl.html(view.render().el);
  },
  edit: function(id) {
    this.contact = this.contacts.get(id);
    var view = new ContactFormView({
          model: this.contact,
          collection: this.contacts
        });
    this.contactEl.html(view.render().el);
  },
  new: function() {
    this.contact = new Contact;
    var view = new ContactFormView({
          model: this.contact,
          collection: this.contacts
        });
    this.contactEl.html(view.render().el);
  }
});