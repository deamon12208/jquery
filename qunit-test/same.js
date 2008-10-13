module("equiv");

test("Basics.", function() {
    var f1 = function () {};
    var f2 = function () {var i = 0};

    // 2 arguments
    equals(QUnit.equiv(function() {var b = 6;}, function() {var a = 5;}), true);
    equals(QUnit.equiv(true, function() {}), false);
    equals(QUnit.equiv(f1, f2), true);
    equals(QUnit.equiv(), true);
    equals(QUnit.equiv(undefined), true);
    equals(QUnit.equiv(null), true);
    equals(QUnit.equiv(0), true);
    equals(QUnit.equiv(1), true);
    equals(QUnit.equiv({}, {}), true);
    equals(QUnit.equiv(0, 0), true);
    equals(QUnit.equiv(0, 1), false);
    equals(QUnit.equiv('', ''), true);
    equals(QUnit.equiv([], []), true);
    equals(QUnit.equiv(null, null), true);
    equals(QUnit.equiv(null, {}), false);
    equals(QUnit.equiv(undefined, undefined), true);
    equals(QUnit.equiv(undefined, null), false);
    equals(QUnit.equiv(null, undefined), false);
    equals(QUnit.equiv(0, undefined), false);
    equals(QUnit.equiv(0, null), false);
    equals(QUnit.equiv(0, ''), false);
    equals(QUnit.equiv(1, '1'), false);
    equals(QUnit.equiv(true, true), true);
    equals(QUnit.equiv(true, false), false);
    equals(QUnit.equiv(0, false), false);
    equals(QUnit.equiv("foobar", "foobar"), true);
    equals(QUnit.equiv("foobar", "foobar", "foobar", "foobar"), true);
    equals(QUnit.equiv("foobar", "foobax"), false);
    equals(QUnit.equiv("foobar", "foobar", "foobax", "foobax"), false);

    // 3 arguments
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

test("OO: Private and public properties", function() {
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

    var match = {
        year: 30,
        isOld: function () {}
    };

    equals(QUnit.equiv(car, car), true);
    equals(QUnit.equiv(car, human), true);
    equals(QUnit.equiv(car, human, car, human), true);
    equals(QUnit.equiv(car, diff, car, car), false);
    equals(QUnit.equiv(car, car, match, car), true);

});