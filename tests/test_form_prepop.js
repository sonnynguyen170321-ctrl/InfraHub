const fs = require('fs');
const path = require('path');

const parseQuery = (search) => {
  const params = new URLSearchParams(search);
  const service = params.get('service');
  const mapping = {
    'ip-transit': 'bandwidth',
    'ddos-protection': 'security',
    'wavelengths': 'bandwidth',
    'cloud-connectivity': 'multi-cloud',
    'colocation': 'colocation',
    'managed-noc': 'other'
  };
  return mapping[service] || '';
};

const assertions = [
  { input: '?service=ddos-protection', expected: 'security' },
  { input: '?service=ip-transit', expected: 'bandwidth' },
  { input: '?service=wavelengths', expected: 'bandwidth' },
  { input: '?service=cloud-connectivity', expected: 'multi-cloud' },
  { input: '?service=colocation', expected: 'colocation' },
  { input: '?service=managed-noc', expected: 'other' },
  { input: '', expected: '' }
];

assertions.forEach(({ input, expected }, index) => {
  const result = parseQuery(input);
  if (result !== expected) {
    console.error(`Test ${index + 1} Failed: Expected "${expected}", got "${result}"`);
    process.exit(1);
  }
});
console.log("URL parser tests passed!");
