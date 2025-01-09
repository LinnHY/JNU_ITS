export default {
    mutations: {
        lock({ curComponent }) {
            curComponent.isLock = true;
            console.log("curComponent=", curComponent);
        },

        unlock({ curComponent }) {
            curComponent.isLock = false;
        },
    },
};
