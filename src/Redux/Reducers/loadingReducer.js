const INITIAL_STATE = false;

const loadingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOADING":
      return true;
    case "DONE":
      return false;
    default:
      return state;
  }
};

export default loadingReducer;
