import { NETWORK_CALL, SET_CONTACTS, SET_CONTACTS_PAGINATION, API_PAGINATION } from './actionTypes';

const initialState = {
    api_call: false,
    api_call_pagination: false,
    contacts: null
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case NETWORK_CALL:
            return { ...state, api_call: action.payload };
        case SET_CONTACTS:
            return { ...state, contacts: action.payload, api_call: false };
        case API_PAGINATION:
            return { ...state, api_call_pagination: action.payload };
        case SET_CONTACTS_PAGINATION:
            return { ...state, contacts: action.payload, api_call_pagination: false };
        default:
            return state;
    }
}
export default reducer;