import React, { useContext, useState, useEffect } from 'react';
import StoreContext from '../contexts/storeContext';
import { loadBugs } from '../store/bugs';

const Bugs = () => {
  const storeContext = useContext(StoreContext);

  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    const store = storeContext;

    const unsubscribe = store.subscribe(() => {
      const bugsInStore = store.getState().entities.bugs.list;
      if (bugs !== bugsInStore) setBugs(() => bugsInStore);
    });

    store.dispatch(loadBugs());

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ul>
      {bugs.map((bug) => (
        <li key={bug.id}>{bug.description}</li>
      ))}
    </ul>
  );
};

export default Bugs;
