const recursive = (_recursive => (
  (_recursive = (arr, idx) =>
    idx < arr.length ? arr[idx] + _recursive(arr, idx + 1) : 0),
  arr => _recursive(arr, 0)
))();

const tailRecursive = (_recursive => (
  (_recursive = (arr, idx, acc) =>
    idx < arr.length ? _recursive(arr, idx + 1, acc + arr[idx]) : acc),
  arr => _recursive(arr, 0, 0)
))();

const iteration = arr => {
  let acc, idx;
  for (acc = 0, idx = 0; idx < arr.length; idx = idx + 1) {
    acc = acc + arr[idx];
  }
  return acc;
};

const expected = arr => arr.reduce((acc, cur) => acc + cur, 0);

describe('w01: 1차원 배열의 합을 구하는 함수를 재귀, 꼬리 재귀, 이터레이션 방식으로 구현', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  it('1. 재귀', () => expect(recursive(arr)).toBe(expected(arr)));

  it('2. 꼬리 재귀', () => expect(tailRecursive(arr)).toBe(expected(arr)));

  it('3. 이터레이션', () => expect(iteration(arr)).toBe(expected(arr)));
});
