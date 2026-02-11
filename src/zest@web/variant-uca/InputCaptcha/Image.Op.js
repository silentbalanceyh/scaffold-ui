import __Zn from '../zero.uca.dependency';

const asyncImage = (config = {}, $session) => {
    const {uri = ""} = config.ajax ? config.ajax : {};
    const headers = {};
    if ($session) {
        headers[__Zn.Env.X_HEADER.X_SESSION] = $session;
    }
    return __Zn.ajaxFetch(uri, {}, {headers}).then(response => new Promise(resolve => {
        const reader = new FileReader();
        console.log(response);
        reader.onload = (event) => resolve(event.target.result);
        const blob = new Blob([response], {type: "image/png"});
        reader.readAsDataURL(blob);
    }))
}
const rxRefresh = (reference) => {
    const {config = {}, $session} = reference.props;
    return __Zn.of(reference).in({
        $imageLoading: true
    }).future(() => asyncImage(config, $session).then($image => {
        const state = {};
        state.$imageLoading = false;
        state.$image = $image;
        __Zn.of(reference).in(state).done();
        // reference.?etState(state);
    }))
    // reference.?etState({$imageLoading: true});
    // return asyncImage(config, $session).then($image => {
    //     const state = {};
    //     state.$imageLoading = false;
    //     state.$image = $image;
    //     reference.?etState(state);
    // })
}
const rxImage = (reference) => (event) => {
    __Zn.prevent(event);
    rxRefresh(reference);
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    asyncImage,
    rxImage,
    rxRefresh,
}