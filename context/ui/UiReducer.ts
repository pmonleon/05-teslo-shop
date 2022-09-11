import { UiState } from "./";

type uiActionType = { type: "UI - toggleMenu", payload: boolean };

export const uiReducer = (state: UiState, action: uiActionType): UiState => {
  switch (action.type) {
    case "UI - toggleMenu":
      return {
        ...state,
        isMenuOpen: action.payload,
      };

    default:
      return state;
  }
};
