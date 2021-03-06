import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteStepAction} from "./actions";
import {DLCodeStep} from "../types";
import {selectedLoadingSelector, selectedSavingSelector} from "./selectors";

export interface DeleteStepButtonProps {
    step:DLCodeStep,
}

const DeleteStepButton:React.FC<DeleteStepButtonProps> = ({step}) => {
    const dispatch = useDispatch();
    const saving = useSelector(selectedSavingSelector);
    const loading = useSelector(selectedLoadingSelector);

    const clickHandler = () => {
        if (window.confirm(`Are you sure you want to delete step #${step.stepOrder + 1} '${step.stepCode}'`)) {
            dispatch(deleteStepAction(step));
        }
    }

    return (
        <button className="btn btn-xs btn-danger" type="button" onClick={clickHandler} disabled={saving||loading}>
            <span className="bi-x-lg" />
        </button>
    )
}
export default DeleteStepButton;
