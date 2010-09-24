

/**
 * Module dependencies.
 */

var jade = require('./../lib/jade'),
    Compiler = jade.Compiler,
    nodes = jade.nodes;

var options = {
    locals: {
        name: 'tj',
        email: 'tj@vision-media.ca',
        role: 'admin'
    }
};

jade.renderFile(__dirname + '/conditionals.jade', options, function(err, html){
    if (err) throw err;
    console.log(html);
});

jade.filters.conditionals = function(block, compiler){
    return new Visitor(block).compile();
};

function Visitor(node) {
    this.node = node;
}

Visitor.prototype.__proto__ = Compiler.prototype;

Visitor.prototype.visit = function(node){
    if (node.name != 'else') this.line(node);
    this.visitNode(node);
};

Visitor.prototype.visitTag = function(node){
    switch (node.name) {
        case 'if':
            var condition = node.block.nodes[0].lines[0],
                block = node.block;
            block.nodes.shift();
            node = new nodes.Code('if (' + condition + ')', false);
            node.block = block;
            this.visit(node);
            break;
        case 'else':
            var block = node.block;
            node = new nodes.Code('else', false);
            node.block = block;
            node.instrumentLineNumber = false;
            this.visit(node);
            break;
        default:
            Compiler.prototype.visitTag.call(this, node);
    }
};