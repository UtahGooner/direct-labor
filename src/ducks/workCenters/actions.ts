import {WorkCenterThunkAction,} from "./types";
import {loadingSelector, selectedWorkCenterSelector,} from "./index";
import {fetchJSON} from "chums-ducks";
import {useSelector} from "react-redux";
import {WorkCenter, WorkCenterList} from "../types";
import {
    changeWorkCenter,
    loadWorkCentersFailed,
    loadWorkCentersRequested,
    loadWorkCentersSucceeded,
    saveWorkCenterRateRequested,
    saveWorkCenterRateSucceeded,
    workCenterSelected
} from "./actionTypes";

const workCenterURL = (workCenter:string = '') => '/api/operations/production/wo/chums/work-centers/:workCenter'
    .replace(':workCenter', encodeURIComponent(workCenter));

export const selectWorkCenterAction = (selected:WorkCenter|null) => ({type: workCenterSelected, payload: {selected}});
export const changeWorkCenterAction = (rate: number) => ({type: changeWorkCenter, payload: {change: rate}})

export const loadWorkCentersAction = ():WorkCenterThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (loadingSelector(state)) {
                return;
            }
            dispatch({type: loadWorkCentersRequested});
            const {workCenters} = await fetchJSON(workCenterURL(), {cache: 'no-cache'});
            const list:WorkCenterList = {};
            workCenters.forEach((wc:WorkCenter) => {
                list[wc.WorkCenterCode] = wc;
            })
            dispatch({type: loadWorkCentersSucceeded, payload: {list}})
        } catch(err:any) {
            console.log("loadWorkCentersAction()", err.message);
            dispatch({type: loadWorkCentersFailed, payload: {error: err, context: loadWorkCentersRequested}})
        }
}

export const saveWorkCenterRate = ():WorkCenterThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (loadingSelector(state)) {
                return;
            }
            const selected = useSelector(selectedWorkCenterSelector);
            if (!selected) {
                return;
            }
            dispatch({type: saveWorkCenterRateRequested});
            const body = JSON.stringify(selected);
            const {workCenter} = await fetchJSON(workCenterURL(selected.WorkCenterCode), {method: 'POST', body});
            dispatch({type: saveWorkCenterRateSucceeded, payload: {selected: workCenter}});
        } catch(err:any) {
            console.log("saveWorkCenterRate()", err.message);
            return Promise.reject(err);
        }
    }

