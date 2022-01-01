import { objectToQueryString } from '../src/objectToQueryString';

describe('objectToQueryString', () => {
  it('returns empty string if no params passed', () => {
    expect(objectToQueryString({})).toEqual('');
  });

  it('returns a key/value pair as a k=v string', () => {
    expect(objectToQueryString({ a: 'x', b: 'y', c: 'z' })).toEqual(
      '?a=x&b=y&c=z'
    );
  });

  it('remove empty value', () => {
    expect(objectToQueryString({ k: '' })).toEqual('');
  });

  it('removes undefined values', () => {
    expect(objectToQueryString({ k: undefined })).toEqual('');
  });

  it('url encodes values', () => {
    expect(objectToQueryString({ k: '/' })).toEqual('?k=%2F');
  });
});
