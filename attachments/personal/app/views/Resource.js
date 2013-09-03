$(function() {

  App.Views.Resource = Backbone.View.extend({

    tagName:  "tr",

    template: _.template($('#resource-item-template').html()),

    events: {
      "click .download" : "downloadAttachment"
    },

    initialize: function() {
      this.model.bind('change', this.render, this)
      this.model.bind('destroy', this.remove, this)
    },

    render: function() {
      /* DEBUGGING
      var obj = this.model.toJSON()
      alert(JSON.stringify(obj))
      Pouch(App.currentPouch).getAttachment(this.model.get('_id') + "/" + _.keys(this.model.get('_attachments'))[0], function(err, res) {
        alert('yar')
        window.URL = window.URL || window.webkitURL
        var link = resource.createElement('a')
        link.innerHTML = 'Click to download style.css.'
        link.href = window.URL.createObjectURL(res)
        // Give the Blob instance a name!
        link.download = 'something.pdf'
        resource.body.appendChild(link)
      })

      console.log(this.model.toJSON())
      */
      var that = this
      this.model.getAttachment()
      this.model.on('getAttachmentDone', function(){
        var model = that.model.toJSON()
        var vars = {
          docId: model._id,
          file: _.keys(model._attachments)[0],
          name: model.name,
          db: 'files'
        }
        that.$el.html(that.template(vars))
      })

      return this
    },

    downloadAttachment: function() {
      var view = this
      Pouch('files', function(err,db) {
        db.get(view.model.get('_id'), function(err,doc) {
          db.getAttachment(view.model.get('_id'),  _.keys(doc['_attachments'])[0], function(err, res) {
            window.location = window.URL.createObjectURL(res)
          }) 
        })
      })

    }

  })

})