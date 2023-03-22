/*
 * every test module exports a value named test.
 * rename them to be unique.
 * each tests module can be run by itself.
 * it should be a SimpleTestModule or
 * another GroupTestModule.
 * 
 * Only the top group Name/Description is used
 * in reports.  If a hierarchy of groups is
 * included in the test, the individual
 * tests are flattened.
 */
import { test as test1 } from './tests/test1.js';
import { test as test2 } from './tests/test2.js';

export const Name = 'GroupName';
export const Description = 'Test a group of tests.';

// the tests export is an array of tests to run
export const tests = [
    test1, test2
];

