function define(context) {
    // Unicorn is defined in app.node/schemas/unicorn.js
    var Unicorn = context.mongoose.model('Unicorn');

    // REST interfaces
    
    // GET index
    context.app.get('/unicorns', function(req,res,next) {
        res.contentType("application/json");
        // var re = new RegExp('.*'+req.query.query+'.*', 'i');
        var query = {};
        if (req.query.query !== undefined) {
            var re = new RegExp(req.query.query+'.*', 'i');
            query = {stringAttr : {$regex:re } };
        }
        Unicorn.find(query,function(err,docs) {
            if (err)
                next(new Error('Unable to fetch entities.'));
            else
                res.json(docs);
        });
    });

    // POST a new unicorn
    context.app.post('/unicorns',function(req,res,next){
        res.contentType("application/json");
        var unicorn = new Unicorn(req.body.unicorn);
        unicorn.save(function(err) {
            if (err) 
                next(new Error('Unable to save unicorn.'));
            else
                res.json(unicorn);
        });
    });

    // PUT an updated unicorn
    context.app.put('/unicorns/:id',function(req,res,next){
        res.contentType("application/json");
        var condition = {'_id':req.params.id};
        Unicorn.update(condition,
                      req.body.unicorn,
                      {multi:true},
                      function(err,num) {
            if (err)
                next(new Error('Unable to update unicorn.'));
            else
                res.json(null);
        });
    });

    // DEL an existing unicorn
    context.app.del('/unicorns/:id',function(req,res,next) {
        res.contentType("application/json");
        Unicorn.findOne({_id:req.params.id},function(err,doc) {
            if (err)
                res.json('unable to find unicorn',404);
            else
                doc.remove(function(err) {
                    if (err)
                        next(new Error('Unable to delete unicorn.'));
                    else
                        res.json(null);
                });
        });
    });
}

exports.define = define;
