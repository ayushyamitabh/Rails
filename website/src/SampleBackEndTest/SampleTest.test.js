import {number, object,string,array} from './SampleTest';

test('Return Type is number', () => {
  expect(number()).toBe(5); //matcher
});
test('Return Type is number', () => {
  expect(number()).not.toBe(1); //matcher opposite
});
test('Return Type is object', () => {
  expect(object()).toEqual({one:1,two:20}); //want the return to be exact
});
test('Return Type is string', () => {
  expect(string()).toMatch(/Rails/); //match for string
});
test('Return Type is array', () => {
  expect(array()).toContain(1); //check element in array
});
