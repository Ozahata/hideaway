import { HIDEAWAY } from '../../src/constants';
import { generateAction, generateStateManagerAction } from '../../src/legacy';
import {
  IHideawayActionContent,
  TFHideawayApi,
  THideawayAny,
} from '../../src/legacyContracts';
import {
  hideConsoleError,
  hideConsoleWarn,
  mockAPI,
  restoreConsoleError,
  restoreConsoleWarn,
} from './__ignore_tests__/common';

describe('action', () => {
  let originalConsoleErr: any;
  let originalConsoleWarn: any;
  beforeAll(() => {
    originalConsoleErr = hideConsoleError();
    originalConsoleWarn = hideConsoleWarn();
  });
  afterAll(() => {
    restoreConsoleError(originalConsoleErr);
    restoreConsoleWarn(originalConsoleWarn);
  });
  describe('generateAction', () => {
    const type = 'MOCK';
    const keys = { mock: 'a' };
    const api = mockAPI() as unknown as TFHideawayApi;

    it('shoud return the simple format', () => {
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        api,
        isStateManager: false,
      };
      const result = generateAction(type, api);
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
    });

    it('should add the complement attribute', () => {
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        api,
        isStateManager: false,
      };
      const result = generateAction(type, api, { complement: keys });
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent, ...keys });
    });

    it('should add the key attribute', () => {
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        api,
        keys,
        isStateManager: false,
      };
      const result = generateAction(type, api, { keys });
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
    });

    it('should be true for allObject', () => {
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        api,
        keys,
        isStateManager: false,
      };
      const result = generateAction(type, api, { keys, allObject: true });
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
    });

    it('should add the predicate attribute', () => {
      const predicate = () => true;
      const result = generateAction(type, api, { predicate });
      expect(result[HIDEAWAY]).toHaveProperty('predicate');
    });

    it('should add the onError attribute', () => {
      const onError = () => {};
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        api,
        onError,
        isStateManager: false,
      };
      const result = generateAction(type, api, { onError });
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
    });

    it('should create an action without api', () => {
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        keys,
        isStateManager: false,
      };
      const result = generateAction(type, undefined, { keys, allObject: true });
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
    });

    it('should send the payload', () => {
      const payload = keys;
      const result = generateAction(type, undefined, {
        keys,
        allObject: true,
        payload,
      });
      expect(result.payload).toStrictEqual(keys);
    });

    it('should ignore the apiPreReducer without api', () => {
      const apiPreReducer = () => 'mock';
      const result = generateAction(type, undefined, {
        keys,
        apiPreReducer,
      });
      expect(result.apiPreReducer).toBeUndefined();
    });

    it('should send the apiPreReducer', () => {
      const apiPreReducer = () => 'mock';
      const result = generateAction(type, api, {
        keys,
        apiPreReducer,
      });
      expect(result[HIDEAWAY]?.apiPreReducer).toEqual(apiPreReducer);
    });
  });

  describe('generateStateManagerAction', () => {
    const type = 'MOCK';
    const keys = { mock: 'a' };
    const api = mockAPI() as unknown as TFHideawayApi;

    it('shoud return the simple format', () => {
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        api,
        isStateManager: true,
      };
      const result = generateStateManagerAction(type, api);
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
    });

    it('should add the complement attribute', () => {
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        api,
        isStateManager: true,
      };
      const result = generateStateManagerAction(type, api, {
        complement: keys,
      });
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent, ...keys });
    });

    it('should add the key attribute', () => {
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        api,
        keys,
        isStateManager: true,
      };
      const result = generateStateManagerAction(type, api, { keys });
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
    });

    it('should be true for allObject', () => {
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        api,
        keys,
        isStateManager: true,
      };
      const result = generateStateManagerAction(type, api, {
        keys,
        allObject: true,
      });
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
    });

    it('should add the predicate attribute', () => {
      const predicate = () => true;
      const result = generateStateManagerAction(type, api, { predicate });
      expect(result[HIDEAWAY]).toHaveProperty('predicate');
    });

    it('should add the onError attribute', () => {
      const onError = () => {};
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        api,
        onError,
        isStateManager: true,
      };
      const result = generateStateManagerAction(type, api, { onError });
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
    });

    it('should create an action without api', () => {
      const APIContent: Partial<IHideawayActionContent<THideawayAny>> = {
        keys,
        isStateManager: true,
      };
      const result = generateStateManagerAction(type, undefined, {
        keys,
        allObject: true,
      });
      expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
    });

    it('should send the payload', () => {
      const payload = keys;
      const result = generateStateManagerAction(type, undefined, {
        keys,
        allObject: true,
        payload,
      });
      expect(result.payload).toStrictEqual(keys);
    });

    it('should ignore the apiPreReducer without api', () => {
      const apiPreReducer = () => 'mock';
      const result = generateStateManagerAction(type, undefined, {
        keys,
        apiPreReducer,
      });
      expect(result.apiPreReducer).toBeUndefined();
    });

    it('should send the apiPreReducer', () => {
      const apiPreReducer = () => 'mock';
      const result = generateStateManagerAction(type, api, {
        keys,
        apiPreReducer,
      });
      expect(result[HIDEAWAY]?.apiPreReducer).toEqual(apiPreReducer);
    });
  });
});
