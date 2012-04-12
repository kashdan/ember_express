// TODO: Edit the schema and register your entity attributes
function define(context) {
    var UnicornSchema = new context.Schema({
        stringAttr : String,
        referenceAttr : String,
        integerAttr : Number,
        booleanAttr : Boolean
    });

    context.mongoose.model('Unicorn',UnicornSchema);
}

exports.define = define;
