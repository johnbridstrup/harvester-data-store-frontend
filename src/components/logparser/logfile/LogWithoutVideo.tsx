import { useReducer, useRef } from "react";
import { VirtuosoHandle } from "react-virtuoso";
import { LogComponent } from "@/features/base/constants";
import { ActionTypesEnum } from "@/features/logparser/logparserTypes";
import LogSearch from "./LogSearch";
import TabbedServices from "./TabbedServices";

interface ComponentState {
  serviceActiveTab: string;
}

interface ActionPayload {
  type: string;
  payload: any;
}

const componentState: ComponentState = {
  serviceActiveTab: "",
};

function reducer(state: ComponentState, action: ActionPayload) {
  switch (action.type) {
    case ActionTypesEnum.ON_SERVICE_TAB_CHANGE:
      return {
        ...state,
        serviceActiveTab: action.payload,
      };
    default:
      return state;
  }
}

function LogWithoutVideo() {
  const [state, dispatchAction] = useReducer(reducer, componentState);
  const virtuoso = useRef<VirtuosoHandle | null>(null);

  return (
    <div>
      <LogSearch
        dispatchAction={dispatchAction}
        virtuoso={virtuoso}
        component={LogComponent.logwithoutvideo}
      />
      <div className="row mb-4">
        <div className="col">
          <TabbedServices
            activeTab={state.serviceActiveTab}
            dispatchAction={dispatchAction}
            virtuoso={virtuoso}
          />
        </div>
      </div>
    </div>
  );
}

export default LogWithoutVideo;
