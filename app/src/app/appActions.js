import { setUrlWorkspaceId, setWorkspaceOverride } from 'workspace/workspaceActions';
import { getURLParameterByName, getURLPieceByName } from 'lib/getURLParameterByName';
import { loadTimebarChartData } from 'timebar/timebarActions';
import { TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE } from 'config';

export const SET_IS_EMBEDDED = 'SET_IS_EMBEDDED';

export function init() {
  return (dispatch) => {

    const workspaceId = getURLParameterByName('workspace') || getURLPieceByName('workspace');
    if (workspaceId !== undefined) {
      dispatch(setUrlWorkspaceId(workspaceId));
    }

    const workspaceOverride = getURLParameterByName('params');
    const workspaceOverridePlainText = getURLParameterByName('paramsPlainText');
    if (workspaceOverride !== null || workspaceOverridePlainText !== null) {
      const workspaceOverrideRawData = (workspaceOverridePlainText !== null)
        ? decodeURIComponent(workspaceOverridePlainText)
        : atob(workspaceOverride);

      let workspaceOverrideJSON;
      try {
        workspaceOverrideJSON = JSON.parse(workspaceOverrideRawData);
      } catch (e) {
        console.warn('malformed workspace override parameter', e);
      }

      if (workspaceOverrideJSON !== undefined) {
        dispatch(setWorkspaceOverride(workspaceOverrideJSON));
      }
    }


    const isEmbedded = getURLParameterByName('embedded') === 'true';
    dispatch({
      type: SET_IS_EMBEDDED,
      payload: isEmbedded
    });

    dispatch(loadTimebarChartData(TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE));
  };
}
