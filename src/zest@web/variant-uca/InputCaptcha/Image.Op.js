import __Zn from '../zero.uca.dependency';

const asyncImage = (config = {}, $session) => {
    const { uri = "", method = "GET" } = config.ajax ? config.ajax : {};
    if ("GET" === method) {
        const headers = {};
        if ($session) {
            headers[__Zn.Env.X_HEADER.X_SESSION] = $session;
        }
        return __Zn.ajaxGet(uri, {}, { headers }).then(response => {
            return response;
        })
    } else {
        console.error("暂不支持")
    }
}
const rxRefresh = (reference) => {
    const { config = {}, $session } = reference.props;
    return __Zn.of(reference).in({
        $imageLoading: true
    }).future(() => asyncImage(config, $session).then($image => {
        const state = {};
        state.$imageLoading = false;
        state.$image = $image.image;
        state.$captchaId = $image.captchaId;

        // 将 captchaId 同步到父组件表单
        const { reference: parentRef } = reference.props;
        if (parentRef && parentRef.formRef && parentRef.formRef.current) {
            parentRef.formRef.current.setFieldsValue({
                captchaId: $image.captchaId
            });
        }

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