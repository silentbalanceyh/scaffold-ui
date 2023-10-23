import Ux from 'ux';

export default {
    yiSource: (reference) => {
        const state = {};
        return Ux.ajaxGet("/api/x-tag/by/sigma").then(tags => {
            state.$source = Ux.clone(tags);
            return Ux.promise(state);
        });
    }
}