const { validateEmail } = require('../lib/validator');

test('email that has @ and . is true', () => {
  expect(validateEmail('yuki@yuki.com')).toBeTruthy();
  expect(validateEmail('i@i.c')).toBeTruthy();
});

test('email without @ is false', () => {
  expect(validateEmail('yukiyuki.com')).toBeFalsy();
});

test('email without . is false', () => {
  expect(validateEmail('yukiyuki@com')).toBeFalsy();
});

test('empty string is false', () => {
  expect(validateEmail('')).toBeFalsy();
});