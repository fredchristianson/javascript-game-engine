
class SimpleTest {
    constructor() {

    }

    // return Name for reports
    get Name() {
        return 'SimpleTest';
    }

    // return Description
    get Description() {
        return 'BOOLEAN help function tests.'
    }

    // do any necessary setup before tests are run
    setup() { }

    /*
     * free resources or anything else needed
     * after all tests are run;
     */
    cleanup() { }

    /*
     * any method beginning with "test_" will be called with
     * a result object (/browser/modules/test/test-result.js).
     * 
     * the result has many methods to set success/fail.
     * if any expect*() method fails, the test is counted as failing.
     * the number of expect*() sucess and failure is not counted
     */
    test_testSomething(result) {
        result.Name = 'BOOLEAN.isTrue';
        result.expectFalse(1 == 2, 'Test 1==2');
        result.expectFalse(1 == 1, 'Test 1==1');
        result.expectTrue(1 == 2, 'Test 1==2');
        result.expectTrue(1 == 1, 'Test 1==1');
    }

}

// every test Module must export a constant named "test"
export const test = new SimpleTest();