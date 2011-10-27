var Contact = Backbone.Model.extend({
  defaults: {
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  },
  validate: function(attrs) {
    var errors;
    if (!attrs.first_name)
      (errors || (errors = {})).first_name = "is blank";
    if (!attrs.last_name)
      (errors || (errors = {})).last_name = "is blank";
    if (!attrs.email)
      (errors || (errors = {})).email = "is blank";
    else if (!/^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i.test(attrs.email))
      (errors || (errors = {})).email = "is invalid";
    if (!attrs.phone)
      (errors || (errors = {})).phone = "is blank";
    return errors;
  },
  fullName: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  },
  reverseFullName: function() {
    return this.get('last_name') + ', ' + this.get('first_name');
  }
});

var Contacts = Backbone.Collection.extend({
  model: Contact,
  comparator: function(contact) {
    return contact.reverseFullName();
  }
});