import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUnresolvedBugs, loadBugs, resolveBug } from '../store/bugs';

class Bugs extends Component {
  componentDidMount() {
    this.props.loadBugs();
  }

  render() {
    return (
      <ul>
        {this.props.unresolvedBugs.map((bug) => (
          <li key={bug.id}>
            {bug.description}
            <button onClick={() => this.props.resolveBug(bug.id)}>
              Resolve
            </button>
          </li>
        ))}
      </ul>
    );
  }
}

const mapStateToProps = (state) => ({
  bugs: state.entities.bugs.list,
  unresolvedBugs: getUnresolvedBugs(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBugs: () => dispatch(loadBugs()),
  resolveBug: (id) => dispatch(resolveBug(id)),
});

// Container
//  Presentation (Bugs)

export default connect(mapStateToProps, mapDispatchToProps)(Bugs);
