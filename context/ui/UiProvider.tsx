import { PropsWithChildren, useReducer } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState {
    isMenuOpen: boolean;
}

const Ui_INITIAL_STATE: UiState = {
    isMenuOpen: false,
}

export const UiProvider: React.FC<PropsWithChildren<UiState>> = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, Ui_INITIAL_STATE);

    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - ToggleMenu' })
    }

    return (
        <UiContext.Provider value={{
            ...state,

            //Method
            toggleSideMenu, 
        }}>
            {children}
        </UiContext.Provider>
    )
}