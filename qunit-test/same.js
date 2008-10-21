module("equiv");

test("Basics: 2 arguments", function () {

    var f1 = function () {};
    var f2 = function () {var i = 0};

    equals(QUnit.equiv(function() {var b = 6;}, function() {var a = 5;}), true);
    equals(QUnit.equiv(true, function() {}), false);
    equals(QUnit.equiv(f1, f2), true);
    equals(QUnit.equiv({a:f1}, {}), false, "Missing property with function's value can fool function bypass");
    equals(QUnit.equiv(), true);
    equals(QUnit.equiv(undefined), true);
    equals(QUnit.equiv(null), true);
    equals(QUnit.equiv(0), true);
    equals(QUnit.equiv(1), true);
    equals(QUnit.equiv({}, {}), true);
    equals(QUnit.equiv(0, 0), true);
    equals(QUnit.equiv(0, 1), false);

    equals(QUnit.equiv(0/0, 0/0), true, "NaN === NaN"); // Nan VS NaN
    equals(QUnit.equiv(1/0, 2/0), true, "Infinity === Infinity"); // Infinity VS Infinity
    equals(QUnit.equiv(0/0, 1/0), false, "NaN === Infinity"); // Nan VS Infinity

    equals(QUnit.equiv('', ''), true);
    equals(QUnit.equiv([], []), true);
    equals(QUnit.equiv([], {}), false);
    equals(QUnit.equiv(null, null), true);
    equals(QUnit.equiv(null, {}), false);
    equals(QUnit.equiv(undefined, undefined), true);
    equals(QUnit.equiv(undefined, null), false);
    equals(QUnit.equiv(null, undefined), false);
    equals(QUnit.equiv(0, undefined), false);
    equals(QUnit.equiv(0, null), false);
    equals(QUnit.equiv(0, ''), false);
    equals(QUnit.equiv(1, '1'), false);
    equals(QUnit.equiv(0, false), false);
    equals(QUnit.equiv(true, true), true);
    equals(QUnit.equiv(true, false), false);
    equals(QUnit.equiv("foobar", "foobar"), true);
});

test("Basics: multiple arguments.", function() {

    function genPowerZero(from, to) {
        var results = [];
        for (var i = to; i >= from; i--) {
            results.push(Math.pow(i, 0));
        }
        return results;
    }

    function genDivisionByZero(from, to) {
        var results = [];
        for (var i = to; i >= from; i--) {
            results.push((i / 0));
        }
        return results;
    }

    function genNaN(from, to) {
        var results = [];
        for (var i = to; i >= from; i--) {
            results.push((i / "foo"));
        }
        return results;
    }

    equals(QUnit.equiv.apply(this, genPowerZero(1,100)), true, "All number from 1 to 100 power 0 equals 1");
    equals(QUnit.equiv.apply(this, genDivisionByZero(1,10)), true, "All number from 1 to 10 divided by 0 equals infinity");
    equals(QUnit.equiv.apply(this, genDivisionByZero(0,10)), false, "All number from 0 to 10 divided by 0 equals infinity"); // false for 0/0 (NaN)
    equals(QUnit.equiv.apply(this, genNaN(0,10)), true, "All number from 0 to 10 divided by a string is NaN");

    equals(QUnit.equiv("foobar", "foobar", "foobar", "foobar"), true);
    equals(QUnit.equiv("foobar", "foobax"), false);
    equals(QUnit.equiv("foobar", "foobar", "foobax", "foobax"), false);

    equals(QUnit.equiv(0, 0, 0, 0, 0), true);
    equals(QUnit.equiv(0, 0, 0, 1, 0), false);
    equals(QUnit.equiv(0, 0, 0, 1, 0), false);
    equals(QUnit.equiv(0, 0, 0, {}, 0), false);
    equals(QUnit.equiv(0, 0, 0, 0, function() {}), false);

    equals(QUnit.equiv(true, false, true), false);
});

test("Arrays.", function() {
    var a = [0];
    var same1 = [1,2,3,true,{},null, [
        {
            a: ["", '1', 0],
            b: function () {}
        },
        5,6,7
    ], "foo"];
    var same2 = [1,2,3,true,{},null, [
        {
            a: ["", '1', 0],
            b: function () {}
        },
        5,6,7
    ], "foo"];
    var diff = [1,2,3,true,{},null, [
        {
            a: ["", '0', 0], // '0' instead of '1'
            b: function () {}
        },
        5,6,7
    ], "foo"];

    equals(QUnit.equiv([undefined],[]), false);
    equals(QUnit.equiv([null],[]), false);
    equals(QUnit.equiv(a,a), true);
    equals(QUnit.equiv([0],[0]), true);
    equals(QUnit.equiv([0,1,2,3,4],[0,1,2,3,4]), true);
    equals(QUnit.equiv([0,1,2,3,4],[0,1,2,3]), false);
    equals(QUnit.equiv([0,1,2,3,[4]],[0,1,2,3,[4]]), true);
    equals(QUnit.equiv([0,1,2,3,[4]],[0,1,2,3,[]]), false);
    equals(QUnit.equiv([0,1,2,3,[4]],[0,1,2,3,[]]), false);
    equals(QUnit.equiv(same1,same1), true);
    equals(QUnit.equiv(same1,same2), true);
    equals(QUnit.equiv(diff,same2), false);
    equals(QUnit.equiv(same1,same1,same2,diff,diff), false);
});

test("Complex Nested Objects.", function() {
    var a = 
        [1,2,3,4,5,6,[
            [5,4,[
                11,{
                    a: 50,
                    b: "string",
                    // return an object! (executed)
                    c: function () {
                        var a = 8; // ignored because it's not public
                        return {
                            d: {},
                            "e": null,
                            f: [1,2, [
                                4,5,6, 7, a
                            ]]
                        };
                    }(),
                    // ignored
                    d: function () {
                        return 0;
                    }
                },22,33
            ],2,1]
        ],8,9,10];

    var b = 
        [1,2,3,4,5,6,[
            [5,4,[
                11,{
                    a: 50,
                    b: "string",
                    // return an object! (executed)
                    c: function () {
                        var a = 8; // ignored because it's not public
                        return {
                            d: {},
                            "e": null,
                            f: [1,2, [
                                4,5,6, 7, a
                            ]]
                        };
                    }(),
                    // ignored
                    d: function () {
                        return 0;
                    }
                },22,33
            ],2,1]
        ],8,9,10];
    
    var c = 
        [1,2,3,4,5,6,[
            [5,4,[
                11,{
                    a: 50,
                    b: "string",
                    // return an object! (executed)
                    c: function () {
                        var a = 8; // ignored because it's not public
                        return {
                            d: {},
                            "e": null,
                            f: [1,2, [
                                4,5,6, 7, a
                            ]]
                        };
                    }(),
                    // ignored
                    d: function () {
                        return 0;
                    }
                },22,33
            ],2,1]
        ],8,9,10];

    var diff = 
        [1,2,3,4,5,6,[
            [5,4,[
                11,{
                    a: 50,
                    b: "string",
                    // return an object! (executed)
                    c: function () {
                        var a = 8; // ignored because it's not public
                        return {
                            d: {},
                            "e": null,
                            f: [1,2, [
                                4,5,6, 7, b // different from a,b,c: b was a
                            ]]
                        };
                    }(),
                    // ignored
                    d: function () {
                        return 0;
                    }
                },22,33
            ],2,1]
        ],8,9,10];

    // a, b and c are identical independant object
    // diff is slightly different
    equals(QUnit.equiv(a,a,a), true);
    equals(QUnit.equiv(a,a,a,a,a,a,a,a,a,diff,a,a,a), false);
    equals(QUnit.equiv(a,a,a,a,a,a,a,a,a,b,a,a,a), true);
    equals(QUnit.equiv(a,b), true);
    equals(QUnit.equiv(a,diff), false);
    equals(QUnit.equiv(a,b,c), true);
    equals(QUnit.equiv(a,b,c,a,b,c,diff), false);
    equals(QUnit.equiv(a,diff,c,a,b,c,a), false);
    equals(QUnit.equiv(a,b,diff), false);
    equals(QUnit.equiv(diff,a,b), false);
});

// Test that private properties are ignored
test("Private and public properties", function() {
    function Car(year) {
        var privateVar = 0;
        this.year = year;
        this.isOld = function() {
            return year > 10;
        }
    }

    function Human(year) {
        var privateVar = 1;
        this.year = year;
        this.isOld = function() {
            return year > 80;
        }
    }

    var car = new Car(30);
    var human = new Human(30);

    var diff = {
        year: 30
    };

    var same = {
        year: 30,
        isOld: function () {}
    };

    equals(QUnit.equiv(car, car), true);
    equals(QUnit.equiv(car, human), true);
    equals(QUnit.equiv(car, human, car, human), true);
    equals(QUnit.equiv(car, diff, car, car), false);
    equals(QUnit.equiv(car, car, same, car), true);
});

// Test that it doesn't chains through prototypal chain inheritance
test("Prototypal inheritance", function() {
    function Gizmo(id) {
        this.id = id;
    }

    function Hoozit(id) {
        this.id = id;
    }
    Hoozit.prototype = new Gizmo();
    Hoozit.prototype.me = true; // not a function to make sure it isn't skip

    var gizmo = new Gizmo("ok");
    var hoozit = new Hoozit("ok");

    equals(QUnit.equiv(hoozit, gizmo), true, "a's prototype is inherit from b's prototype and augmented, but the chain is not traversed and not compared");
});
