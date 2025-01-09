export default {
    state: {
        curStepId: 1,
        curLogicStepId: 1,
    },
    mutations: {
        addStep(state) {
            state.curComponent.stepId = state.curStepId;
            state.curComponent.logicStepId = 0;
            state.curStepId += 1;
        },
        addLogicStep(state, logicStepId) {
            state.curComponent.stepId = state.curStepId;
            state.curComponent.logicStepId = logicStepId;
            state.curStepId += 1;
            state.curLogicStepId = logicStepId + 1;
        },
        addstuCurStep(state, nowaStep) {
            state.stuCurStep = nowaStep + 1;
            console.log("state.stuCurStep=", state.stuCurStep);
        },
        addstuCurLogicStep(state) {
            state.stuCurLogicStep += 1;
            console.log("state.stuCurLogicStep=", state.stuCurLogicStep);
        },
        releaseStepOrNot(state) {
            for (let i = 0; i < state.componentData.length; i++) {
                if (
                    state.componentData[i].logicStepId != undefined &&
                    state.componentData[i].logicStepId == state.stuCurLogicStep
                ) {
                    state.componentData[i].isLock = false;
                }
            }
        },
    },
};
