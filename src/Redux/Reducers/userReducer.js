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
  restriction: false,
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
      return (state = INITIAL_STATE);
    case "NEWEDIT":
      return { ...state, edit: action.payload };
    case "DONE":
      return { ...state, loading: false };
    case "CLEARERROR":
      return { ...state, error: false, error_mes: "" };
    default:
      return state;
  }
};

export default userReducer;
