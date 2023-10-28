import { createContext, useContext, useReducer } from "react";

const UserContext = createContext();

const initialState = {
  isAuth: false,
  user: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'login': {
      return {
        // future proof
        ...state,
        isAuth: true,
        user: action.payload
      }
    }
    case 'logout': {
      return initialState;
    }
    default: {
      throw new Error('Unknown action type !');
    }
  }
}

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

export const UserProvider = ({ children }) => {
  const [{ user, isAuth }, dispatch] = useReducer(reducer, initialState);

  function login(email, password) {
    if(email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({
        type: 'login',
        payload: FAKE_USER
      })
    }
  }

  function logout() {
    dispatch({
      type: 'logout',
    })
  }

  return (
    <UserContext.Provider
      value={{
        isAuth,
        login,
        logout,
        user
      }}>
      {children}
    </UserContext.Provider>
  )
}


export const useUserContext = () => {
  const value = useContext(UserContext);

  if (!value) throw new Error('UserContext was used outside of its provider');

  return value;
}
