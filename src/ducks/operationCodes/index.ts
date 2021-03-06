import {combineReducers} from "redux";
import {
    defaultState,
    OperationCodeAction,
    operationCodeDefaultSort,
    operationCodeKey,
    operationCodeSorter,
    OperationCodeSorterProps
} from "./types";
import {RootState} from "../index";
import {routingDetailKey} from "../routing";
import {OperationCode, OperationCodeList} from "../types";


export const loadOCListRequested = 'operationCodes/loadListRequested';
export const loadOCListSucceeded = 'operationCodes/loadListSucceeded';
export const loadOCListFailed = 'operationCodes/loadListFailed';
export const loadOCRequested = 'operationCodes/loadCodeRequested';
export const loadOCSucceeded = 'operationCodes/loadCodeSucceeded';
export const loadOCFailed = 'operationCodes/loadCodeFailed';
export const operationCodeSelected = 'operationCodes/codeSelected';
export const workCenterChanged = 'operationCodes/workCenterChanged';
export const searchChanged = 'operationCodes/searchChanged';

export const countRecordsSelector = (state: RootState) => Object.keys(state.operationCodes.list).length;

export const listSelector = (state:RootState):OperationCode[] => Object.values(state.operationCodes.list)
    .sort(operationCodeSorter(operationCodeDefaultSort));

export const filteredListSelector = (sort: OperationCodeSorterProps) => (state: RootState): OperationCode[] => {
    const {filterWC, filter, list} = state.operationCodes;
    let searchRegex = /^/;
    try {
        searchRegex = new RegExp(filter, 'i');
    } catch (err) {
    }
    return Object.values(list)
        .filter(oc => !filterWC || oc.WorkCenter === filterWC)
        .filter(oc => searchRegex.test(oc.OperationCode) || searchRegex.test(oc.OperationDescription))
        .sort(operationCodeSorter(sort));
}


export const filterWorkCenterSelector = (state: RootState): string => state.operationCodes.filterWC;
export const filterSelector = (state: RootState): string => state.operationCodes.filter;
export const searchRegexSelector = (state: RootState): RegExp => {
    try {
        return new RegExp(state.operationCodes.filter, 'i');
    } catch (err) {
        return /^/;
    }
}

export const selectedOCSelector = (state: RootState): OperationCode | null => state.operationCodes.selected;
export const loadingSelector = (state: RootState): boolean => state.operationCodes.loading;
export const loadedSelector = (state: RootState): boolean => state.operationCodes.loaded;
export const whereUsedSelector = (state: RootState): string[] => state.operationCodes.whereUsed;

export const operationCodeSelector = (workCenter?: string, operationCode?: string) =>
    (state: RootState): OperationCode | null => {
        if (!workCenter || !operationCode) {
            return null;
        }
        const key = operationCodeKey({WorkCenter: workCenter, OperationCode: operationCode});
        return state.operationCodes.list[key] || null;
    }

const listReducer = (state: OperationCodeList = defaultState.list, action: OperationCodeAction): OperationCodeList => {
    const {type, payload} = action;
    switch (type) {
    case loadOCListSucceeded:
        return payload?.list || {};
    case loadOCSucceeded:
        if (payload?.selected) {
            const key = operationCodeKey(payload.selected)
            return {
                ...state,
                [key]: payload.selected,
            }
        }
        return state;
    default:
        return state;
    }
}

const selectedReducer = (state: OperationCode | null = defaultState.selected, action: OperationCodeAction): OperationCode | null => {
    const {type, payload} = action;
    switch (type) {
    case loadOCSucceeded:
    case operationCodeSelected:
        return payload?.selected || null;
    case loadOCListSucceeded:
        return null;
    default:
        return state;
    }
}

const whereUsedReducer = (state: string[] = defaultState.whereUsed, action: OperationCodeAction): string[] => {
    const {type, payload} = action;
    switch (type) {
    case loadOCRequested:
        return [];
    case loadOCSucceeded:
        if (payload?.routings) {
            return payload.routings.map(rd => routingDetailKey(rd)).sort();
        }
        return state;
    default:
        return state;
    }
}

const filterWCReducer = (state: string = defaultState.filterWC, action: OperationCodeAction): string => {
    const {type, payload} = action;
    switch (type) {
    case workCenterChanged:
        return payload?.filter || '';
    default:
        return state;
    }
}

const filterReducer = (state: string = defaultState.filter, action: OperationCodeAction): string => {
    const {type, payload} = action;
    switch (type) {
    case searchChanged:
        return payload?.filter || '';
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = defaultState.loading, action: OperationCodeAction): boolean => {
    switch (action.type) {
    case loadOCListRequested:
    case loadOCRequested:
        return true;
    case loadOCListSucceeded:
    case loadOCListFailed:
    case loadOCSucceeded:
    case loadOCFailed:
        return false;
    default:
        return state;
    }
}

const loadedReducer = (state: boolean = defaultState.loading, action: OperationCodeAction): boolean => {
    switch (action.type) {
    case loadOCListSucceeded:
        return true;
    case loadOCListFailed:
        return false;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    whereUsed: whereUsedReducer,
    filterWC: filterWCReducer,
    filter: filterReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
})
