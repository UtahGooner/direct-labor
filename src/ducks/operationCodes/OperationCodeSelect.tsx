import React, {ChangeEvent, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {OperationCode} from "../types";
import {InputGroup, Select} from "chums-ducks";
import {listSelector, loadedSelector} from "./index";
import {operationCodeKey} from "./types";
import {sageOperationCodeIcon} from "../../icons";
import classNames from "classnames";
import {loadOperationCodesAction} from "./actions";

export interface OperationCodeSelectProps {
    operationCode: string,
    workCenter: string,
    onChange: (opCode: OperationCode | null) => void,
}

const OperationCodeSelect: React.FC<OperationCodeSelectProps> = ({operationCode, workCenter, onChange}) => {
    const dispatch = useDispatch();
    const loaded = useSelector(loadedSelector)
    const operationCodes = useSelector(listSelector);
    const options = Object.values(operationCodes).filter(oc => !workCenter || oc.WorkCenter === workCenter);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadOperationCodesAction())
        }
    }, [])

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [wc] = operationCodes.filter(oc => operationCodeKey(oc) === ev.target.value);
        onChange(wc || null);
    }

    const value = operationCodeKey({OperationCode: operationCode, WorkCenter: workCenter});
    return (
        <InputGroup bsSize="sm">
            <div className={classNames("input-group-text", sageOperationCodeIcon)}/>
            <Select value={value} onChange={changeHandler}>
                <option value="">Select OperationCode</option>
                {options.map(oc => (
                    <option key={operationCodeKey(oc)} value={operationCodeKey(oc)}>
                        {!workCenter ? oc.WorkCenter + ':' : ''}{oc.OperationCode} / {oc.OperationDescription}
                    </option>
                ))}
            </Select>
        </InputGroup>
    )
}

export default OperationCodeSelect;
