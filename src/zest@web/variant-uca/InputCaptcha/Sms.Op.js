import __Zn from '../zero.uca.dependency';

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
    if (!values.verify) {
        __Zn.messageFailure(error.verify);
        return false;
    }
    if (!values.agree) {
        __Zn.messageFailure(error.agree);
        return false;
    }
    return values;
}

const setMessage = (reference, isSend, callbackFn) => {
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

        setMessage(reference, true, () => {
            console.log(values);
        })
    },
    rxFinish: (reference) => (event) => {
        setMessage(reference, false, () => {
        });
    }
}