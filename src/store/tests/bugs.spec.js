import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureStore from '../configureStore';
import { loadBugs, addBug, resolveBug, getUnresolvedBugs } from '../bugs';

describe('bugsSlice', () => {
  let store;
  let fakeAxios;

  beforeEach(() => {
    store = configureStore();
    fakeAxios = new MockAdapter(axios);
  });

  const bugsSlice = () => store.getState().entities.bugs;
  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  describe('loading bugs', () => {
    describe('if the bugs exists in the cache', () => {
      it('should not be fetched from the server again', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        expect(fakeAxios.history.get.length).toBe(1);
      });
    });
    describe("if the bugs dont't exists in the cache", () => {
      it('should be fetched from the server and put in the store', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(bugsSlice().list).toHaveLength(1);
      });

      describe('loading indicator', () => {
        it('should be true while fetching the bugs', () => {
          fakeAxios.onGet('/bugs').reply(() => {
            expect(bugsSlice().loading).toBe(true);
            return [200, [{ id: 1 }]];
          });

          store.dispatch(loadBugs());
        });

        it('should be false after the bugs are fetched', async () => {
          fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });

        it('should be false if the server returns an error', async () => {
          fakeAxios.onGet('/bugs').reply(500);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });
      });
    });
  });

  it("should mark the bug as resolved if it's save to the server", async () => {
    fakeAxios.onPost('/bugs').reply(200, { id: 1 });
    fakeAxios.onPatch('/bugs/1').reply(200, { id: 1, resolved: true });

    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(1));

    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  it("should not mark the bug as resolved if it's not save to the server", async () => {
    fakeAxios.onPost('/bugs').reply(200, { id: 1 });
    fakeAxios.onPatch('/bugs/1').reply(500);

    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(1));

    expect(bugsSlice().list[0].resolved).not.toBe(true);
  });

  it("should add the but to the store if it's save to the server", async () => {
    // Arrange
    const bug = { description: 'a' };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost('/bugs').reply(200, savedBug);

    // Act
    await store.dispatch(addBug(bug));

    // Assert
    expect(bugsSlice().list).toContainEqual(savedBug);
  });

  it("should not add the but to the store if it's not save to the server", async () => {
    const bug = { description: 'a' };
    fakeAxios.onPost('/bugs').reply(500);

    await store.dispatch(addBug(bug));

    expect(bugsSlice().list).toHaveLength(0);
  });

  describe('selectors', () => {
    it('getUnresolvedBugs', () => {
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 2 },
        { id: 3 },
      ];

      const res = getUnresolvedBugs(state);

      expect(res).toHaveLength(2);
    });
  });
});

// solitary test
// import { addBug, bugAdded } from '../bugs';
// import { apiRequest } from '../api';

// describe('bugsSlice', () => {
//   describe('action creators', () => {
//     it('addBug', () => {
//       const bug = { description: 'a' };
//       const res = addBug(bug);
//       const expected = {
//         type: apiRequest.type,
//         payload: {
//           url: '/bugs',
//           method: 'post',
//           data: bug,
//           onSuccess: bugAdded.type,
//         },
//       };

//       expect(res).toEqual(expected);
//     });
//   });
// });
