import React from 'react';
import MainNav from "./MainNav";
import RoutingContent from "./RoutingContent";
import {AlertList} from "chums-ducks";
import WorkCenterContent from "./WorkCenterContent";
import OperationCodesContent from "./OperationCodesContent";
import {Route} from 'react-router-dom';
import {
    dlCodesRouterPath,
    dlStepsRouterPath,
    operationCodesRouterPath,
    routingRouterPath,
    workCenterRouterPath
} from "../routerPaths";
import DirectLaborCodesContent from "./DirectLaborCodesContent";
import DirectLaborStepsContent from "./DirectLaborStepsContent";

const mainTabKey = 'dl-main';

const App: React.FC = () => {
    return (
        <>
            <AlertList/>
            <div className="row g-3">
                <div className="col-auto">
                    <MainNav tabKey={mainTabKey}/>
                </div>
                <div className="col">
                    <Route path={routingRouterPath} component={RoutingContent}/>
                    <Route path={workCenterRouterPath} component={WorkCenterContent}/>
                    <Route path={operationCodesRouterPath} component={OperationCodesContent}/>
                    <Route path={dlCodesRouterPath} component={DirectLaborCodesContent}/>
                    <Route path={dlStepsRouterPath} component={DirectLaborStepsContent}/>
                </div>
            </div>
        </>
    )
}

export default App;
