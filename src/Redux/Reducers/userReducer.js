const INITIAL_STATE = {
  id: null,
  isLogIn: false,
  is_verified: 0,
  username: "",
  loading: false,
  error: false,
  error_mes: "",
  email: "",
  fullname: "",
  bio: "",
  profile_picture: "",
  profile_cover: "",
  comment: false,
  deleted: false,
  edit: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
        error: false,
        error_mes: "",
      };
    case "LOGIN":
      return {
        ...state,
        loading: false,
        isLogIn: true,
        error_mes: "",
        ...action.payload,
      };
    case "ERROR":
      return {
        ...state,
        error: true,
        error_mes: action.payload,
      };
    case "LOGOUT":
      return INITIAL_STATE;
    case "NEWCOMMENT":
      return { ...state, comment: true };
    case "NOCOMMENT":
      return { ...state, comment: false };
    case "NEWDELETE":
      return { ...state, deleted: true };
    case "NODELETE":
      return { ...state, deleted: false };
    case "NEWEDIT":
      return { ...state, edit: action.payload };
    case "NOEDIT":
      return { ...state, edit: null };
    case "DONE":
      return { ...state, loading: false };
    case "CLEARERROR":
      return { ...state, error: false, error_mes: "" };
    default:
      return state;
  }
};

export default userReducer;
