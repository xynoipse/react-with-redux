import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadBugs, getUnresolvedBugs, resolveBug } from '../store/bugs';

const BugsList = () => {
  const dispatch = useDispatch();
  const bugs = useSelector((state) => state.entities.bugs.list);
  const unresolvedBugs = useSelector(getUnresolvedBugs);

  useEffect(() => {
    dispatch(loadBugs());
  }, []);

  return (
    <ul>
      {unresolvedBugs.map((bug) => (
        <li key={bug.id}>
          <span>{bug.description} </span>
          <button onClick={() => dispatch(resolveBug(bug.id))}>Resolve</button>
        </li>
      ))}
    </ul>
  );
};

export default BugsList;
