import Ux from 'ux';

export default {
    onError: (reference, error) => {
        const {rxError = () => false} = reference.props;
        if (Ux.isFunction(rxError)) {
            rxError(error);
        }
    },
    onLoading: (reference) => {
        const {rxLoading = () => false} = reference.props;
        if (Ux.isFunction(rxLoading)) {
            rxLoading(true);
        }
    },
    onShow: (reference, warnings) => {
        const {rxShow = () => false} = reference.props;
        if (Ux.isFunction(rxShow)) {
            rxShow(warnings);
        }
    }
}