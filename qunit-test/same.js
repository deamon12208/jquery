module("same");

test("Basics.", function() {
    var f1 = function () {};
    var f2 = function () {var i = 0};

    // 2 arguments
    equals(same(function() {var b = 6;}, function() {var a = 5;}), true);
    equals(same(true, function() {}), false);
    equals(same(f1, f2), true);
    equals(same(), true);
    equals(same(undefined), true);
    equals(same(null), true);
    equals(same(0), true);
    equals(same(1), true);
    equals(same({}, {}), true);
    equals(same(0, 0), true);
    equals(same(0, 1), false);
    equals(same('', ''), true);
    equals(same([], []), true);
    equals(same(null, null), true);
    equals(same(null, {}), false);
    equals(same(undefined, undefined), true);
    equals(same(undefined, null), false);
    equals(same(null, undefined), false);
    equals(same(0, undefined), false);
    equals(same(0, null), false);
    equals(same(0, ''), false);
    equals(same(1, '1'), false);
    equals(same(true, true), true);
    equals(same(true, false), false);
    equals(same(0, false), false);
    equals(same("foobar", "foobar"), true);
    equals(same("foobar", "foobar", "foobar", "foobar"), true);
    equals(same("foobar", "foobax"), false);
    equals(same("foobar", "foobar", "foobax", "foobax"), false);

    // 3 arguments
    equals(same(0, 0, 0, 0, 0), true);
    equals(same(0, 0, 0, 1, 0), false);
    equals(same(0, 0, 0, 1, 0), false);
    equals(same(0, 0, 0, {}, 0), false);
    equals(same(0, 0, 0, 0, function() {}), false);
    equals(same(true, false, true), false);
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
    equals(same(a,a), true);
    equals(same([0],[0]), true);
    equals(same([0,1,2,3,4],[0,1,2,3,4]), true);
    equals(same([0,1,2,3,4],[0,1,2,3]), false);
    equals(same([0,1,2,3,[4]],[0,1,2,3,[4]]), true);
    equals(same([0,1,2,3,[4]],[0,1,2,3,[]]), false);
    equals(same([0,1,2,3,[4]],[0,1,2,3,[]]), false);
    equals(same(same1,same1), true);
    equals(same(same1,same2), true);
    equals(same(diff,same2), false);
    equals(same(same1,same1,same2,diff,diff), false);
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
    equals(same(a,a,a), true);
    equals(same(a,a,a,a,a,a,a,a,a,diff,a,a,a), false);
    equals(same(a,a,a,a,a,a,a,a,a,b,a,a,a), true);
    equals(same(a,b), true);
    equals(same(a,diff), false);
    equals(same(a,b,c), true);
    equals(same(a,b,c,a,b,c,diff), false);
    equals(same(a,diff,c,a,b,c,a), false);
    equals(same(a,b,diff), false);
    equals(same(diff,a,b), false);
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

    equals(same(car, car), true);
    equals(same(car, human), true);
    equals(same(car, human, car, human), true);
    equals(same(car, diff, car, car), false);
    equals(same(car, car, match, car), true);

});