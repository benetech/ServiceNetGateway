import axios from 'axios';

import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import sinon from 'sinon';

import reducer, {
  ACTION_TYPES,
  createEntity,
  deleteEntity,
  getEntities,
  getEntity,
  updateEntity,
  reset
} from 'app/entities/field-exclusion/field-exclusion.reducer';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IFieldExclusion, defaultValue } from 'app/shared/model/field-exclusion.model';
import { IExclusionsConfig } from 'app/shared/model/exclusions-config.model';

// tslint:disable no-invalid-template-strings
describe('Entities reducer tests', () => {
  function isEmpty(element): boolean {
    if (element instanceof Array) {
      return element.length === 0;
    } else {
      return Object.keys(element).length === 0;
    }
  }

  const initialState = {
    loading: false,
    errorMessage: null,
    entities: [] as ReadonlyArray<IFieldExclusion>,
    entity: defaultValue,
    configs: [] as ReadonlyArray<IExclusionsConfig>,
    updating: false,
    totalItems: 0,
    updateSuccess: false
  };

  function testInitialState(state) {
    expect(state).toMatchObject({
      loading: false,
      errorMessage: null,
      updating: false,
      updateSuccess: false
    });
    expect(isEmpty(state.entities));
    expect(isEmpty(state.entity));
  }

  function testMultipleTypes(types, payload, testFunction) {
    types.forEach(e => {
      testFunction(reducer(undefined, { type: e, payload }));
    });
  }

  describe('Common', () => {
    it('should return the initial state', () => {
      testInitialState(reducer(undefined, {}));
    });
  });

  describe('Requests', () => {
    it('should set state to loading', () => {
      testMultipleTypes([REQUEST(ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST), REQUEST(ACTION_TYPES.FETCH_FIELDEXCLUSION)], {}, state => {
        expect(state).toMatchObject({
          errorMessage: null,
          updateSuccess: false,
          loading: true
        });
      });
    });

    it('should set state to updating', () => {
      testMultipleTypes(
        [
          REQUEST(ACTION_TYPES.CREATE_FIELDEXCLUSION),
          REQUEST(ACTION_TYPES.UPDATE_FIELDEXCLUSION),
          REQUEST(ACTION_TYPES.DELETE_FIELDEXCLUSION)
        ],
        {},
        state => {
          expect(state).toMatchObject({
            errorMessage: null,
            updateSuccess: false,
            updating: true
          });
        }
      );
    });

    it('should reset the state', () => {
      expect(
        reducer(
          { ...initialState, loading: true },
          {
            type: ACTION_TYPES.RESET
          }
        )
      ).toEqual({
        ...initialState
      });
    });
  });

  describe('Failures', () => {
    it('should set a message in errorMessage', () => {
      testMultipleTypes(
        [
          FAILURE(ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST),
          FAILURE(ACTION_TYPES.FETCH_FIELDEXCLUSION),
          FAILURE(ACTION_TYPES.CREATE_FIELDEXCLUSION),
          FAILURE(ACTION_TYPES.UPDATE_FIELDEXCLUSION),
          FAILURE(ACTION_TYPES.DELETE_FIELDEXCLUSION)
        ],
        'error message',
        state => {
          expect(state).toMatchObject({
            errorMessage: 'error message',
            updateSuccess: false,
            updating: false
          });
        }
      );
    });
  });

  describe('Successes', () => {
    it('should fetch all entities', () => {
      const headers = { ['x-total-count']: 2 };
      const payload = { data: [{ 1: 'fake1' }, { 2: 'fake2' }], headers };
      expect(
        reducer(undefined, {
          type: SUCCESS(ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST),
          payload
        })
      ).toEqual({
        ...initialState,
        loading: false,
        entities: payload.data,
        totalItems: headers['x-total-count']
      });
    });

    it('should fetch a single entity', () => {
      const payload = { data: { 1: 'fake1' } };
      expect(
        reducer(undefined, {
          type: SUCCESS(ACTION_TYPES.FETCH_FIELDEXCLUSION),
          payload
        })
      ).toEqual({
        ...initialState,
        loading: false,
        entity: payload.data
      });
    });

    it('should create/update entity', () => {
      const payload = { data: 'fake payload' };
      expect(
        reducer(undefined, {
          type: SUCCESS(ACTION_TYPES.CREATE_FIELDEXCLUSION),
          payload
        })
      ).toEqual({
        ...initialState,
        updating: false,
        updateSuccess: true,
        entity: payload.data
      });
    });

    it('should delete entity', () => {
      const payload = 'fake payload';
      const toTest = reducer(undefined, {
        type: SUCCESS(ACTION_TYPES.DELETE_FIELDEXCLUSION),
        payload
      });
      expect(toTest).toMatchObject({
        updating: false,
        updateSuccess: true
      });
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk, promiseMiddleware]);
      store = mockStore({});
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.post = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.put = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.delete = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(getEntities()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.FETCH_FIELDEXCLUSION actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_FIELDEXCLUSION)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_FIELDEXCLUSION),
          payload: resolvedObject
        }
      ];
      await store.dispatch(getEntity(42666)).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.CREATE_FIELDEXCLUSION actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.CREATE_FIELDEXCLUSION)
        },
        {
          type: SUCCESS(ACTION_TYPES.CREATE_FIELDEXCLUSION),
          payload: resolvedObject
        },
        {
          type: REQUEST(ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(createEntity({ id: 1 })).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.UPDATE_FIELDEXCLUSION actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.UPDATE_FIELDEXCLUSION)
        },
        {
          type: SUCCESS(ACTION_TYPES.UPDATE_FIELDEXCLUSION),
          payload: resolvedObject
        },
        {
          type: REQUEST(ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(updateEntity({ id: 1 })).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.DELETE_FIELDEXCLUSION actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.DELETE_FIELDEXCLUSION)
        },
        {
          type: SUCCESS(ACTION_TYPES.DELETE_FIELDEXCLUSION),
          payload: resolvedObject
        },
        {
          type: REQUEST(ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_FIELDEXCLUSION_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(deleteEntity(42666)).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.RESET actions', async () => {
      const expectedActions = [
        {
          type: ACTION_TYPES.RESET
        }
      ];
      await store.dispatch(reset());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
