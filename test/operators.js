"use strict";

var O = require('../lib/operators'),
    C = require('../lib/combinators'),
    M = require('../lib/maybeerror'),
    assert = require('assert');

var module = describe,
    test = it,
    deepEqual = assert.deepEqual;

module('operators', function() {
    var plus = C.seq2R(C.basic.literal('+'), C.pure(function(x,y) {return [x, y];})),
        bang = C.seq2R(C.basic.literal('!'), C.pure(function(x) {return '!(' + x + ')';})),
        question = C.seq2R(C.basic.literal('?'), C.pure(function q(y) {return '(' + y + ')?';})),
        num = C.fmap(parseFloat, C.basic.oneOf('0123456789'));
    
    test("chainL", function() {
        var parser = O.chainL(plus, num),
            a = parser.parse('8+4+2+1abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(v.result, [[[8,4],2],1]);
    });
    
    test("chainL2", function() {
        var parser = O.chainL2(plus, num),
            a = parser.parse('8+4+2+1abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(v.result, [[[8,4],2],1]);
    });
    
    test("chainR", function() {
        var parser = O.chainR(plus, num),
            a = parser.parse('8+4+2+1abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(v.result, [8,[4,[2,1]]]);
    });

    test("chainR2", function() {
        var parser = O.chainR2(plus, num),
            a = parser.parse('8+4+2+1abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(v.result, [8,[4,[2,1]]]);
    });
    
    test("chainR3", function() {
        var p = C.basic.literal('+'),
            n = C.basic.oneOf('0123456789'),
            util = require('util');
        var parser = O.chainR3(p, n),
            a = parser.parse('8+4+2+1abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(O.dump(v.result), '(+ 8 (+ 4 (+ 2 1)))');
    });
    
    test("chainL3", function() {
        var p = C.basic.literal('+'),
            n = C.basic.oneOf('0123456789'),
            util = require('util');
        var parser = O.chainL3(p, n),
            a = parser.parse('8+4+2+1abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(O.dump(v.result), '(+ (+ (+ 8 4) 2) 1)');
    });
    
    test("prefix", function() {
        var parser = O.prefix(bang, num),
            a = parser.parse('!!!8abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(v.result, '!(!(!(8)))');
    });
    
    test("postfix", function() {
        var parser = O.postfix(question, num),
            a = parser.parse('8???abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(v.result, '(((8)?)?)?');        
    });

    test("prefix2", function() {
        var parser = O.prefix2(bang, num),
            a = parser.parse('!!!8abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(v.result, '!(!(!(8)))');
    });
    
    test("postfix2", function() {
        var parser = O.postfix2(question, num),
            a = parser.parse('8???abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(v.result, '(((8)?)?)?');
    });

    test("prefix3", function() {
        var parser = O.prefix3(C.basic.literal('!'), num),
            a = parser.parse('!!!8abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(O.dump(v.result), '(! (! (! 8)))');
    });
    
    test("postfix3", function() {
        var parser = O.postfix3(C.basic.literal('?'), num),
            a = parser.parse('8???abc', 'state'),
            v = a.value;
        deepEqual(a.status, 'success');
        deepEqual(v.rest, 'abc');
        deepEqual(v.state, 'state');
        deepEqual(O.dump(v.result), '(((8 ?) ?) ?)');
    });

});
