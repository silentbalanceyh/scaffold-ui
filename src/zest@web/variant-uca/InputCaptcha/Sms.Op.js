import __Zn from '../zero.uca.dependency';
import dayjs from "dayjs";

const getFormValue = (reference) => {
    const ref = reference.props.reference;
    if (!ref) {
        return {};
    }
    const formValue = __Zn.formGet(ref);
    const {config = {}} = reference.props;
    const mapping = config.input;
    const normalized = {};
    Object.keys(mapping).forEach(fieldTarget => {
        const fieldSource = mapping[fieldTarget];
        normalized[fieldTarget] = formValue[fieldSource];
    })
    return normalized;
}

const verifyInput = (reference) => {
    const values = getFormValue(reference);
    const {config = {}} = reference.props;
    const error = config.error ? config.error : {};
    if (!values.mobile) {
        __Zn.messageFailure(error.mobile);
        return false;
    }
    if (!values.captcha) {
        __Zn.messageFailure(error.captcha);
        return false;
    }
    return values;
}

const callbackFailure = (reference) => (error) => {
    const {data = {}} = error;
    if (data.info) {
        __Zn.messageFailure(data.info);
    }
    const {$session} = reference.props;
    // 特殊流程（一旦登录失败刷新验证码）
    if ($session) {
        const ref = reference.props.reference;
        const session = __Zn.randomString(48);
        __Zn.of(ref).in({
            $session: session
        }).done()
    }
}

const sendMessage = (reference, params = {}) => {
    const {config = {}} = reference.props;
    const {uri = "", method = "POST"} = config.ajax ? config.ajax : {};
    if ("POST" === method) {
        const {$session} = reference.props;
        const headers = {};
        if ($session) {
            headers[__Zn.Env.X_HEADER.X_SESSION] = $session;
        }
        return __Zn.ajaxPush(uri, params, {headers});
    } else {
        console.error("暂不支持")
    }
}

const handleMessage = (reference, isSend, callbackFn) => {
    const ref = reference.props.reference;
    if (!ref) {
        return;
    }
    __Zn.of(ref).in({$message: isSend}).handle(callbackFn);
}
export default {
    rxClick: (reference) => (event) => {
        __Zn.prevent(event);
        const values = verifyInput(reference);
        if (!values) {
            return;
        }
        // 直接在状态中设置
        __Zn.of(reference).in({
            $seconds: dayjs().add(120, 'second'),
        }).handle(() => {
            const request = {};
            request.mobile = values.mobile;
            request.captcha = values.captcha;
            return sendMessage(reference, request).then(response => {
                handleMessage(reference, true, () => {
                })
            }).catch(callbackFailure(reference));
        })
    },
    rxFinish: (reference) => (event) => {
        handleMessage(reference, false, () => {
            __Zn.of(reference).in({
                $seconds: null
            }).done()
        });
    }
}