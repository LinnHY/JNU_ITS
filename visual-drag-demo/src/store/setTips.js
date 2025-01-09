export default {
    state: {
        tipsArr: [],
    },
    mutations: {
        addToTipsArr(state, { content, index }) {
            if (index < state.tipsArr.length) {
                state.tipsArr.splice(index, 1, content);
            } else {
                state.tipsArr = state.tipsArr.concat(
                    Array.from({ length: index - state.tipsArr.length }, () => null),
                    content
                );
            }
        },
    },
    actions: {
        addToTipsArr({ commit }, payload) {
            commit("addToTipsArr", payload);
        },
    },
};
