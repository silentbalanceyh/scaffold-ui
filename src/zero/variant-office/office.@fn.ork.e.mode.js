import __Zn from './zero.office.dependency';
// eslint-disable-next-line import/no-anonymous-default-export
export default (configuration = {}, parameters = {}) => {
    const editorConfig = configuration?.editorConfig ? configuration?.editorConfig : {};

    const {
        pView = false
    } = parameters;
    if (pView) {
        editorConfig.coEditing = {
            "mode": "fast",
            "change": true,
        }
        editorConfig.mode = "view";
    }
    return __Zn.promise(configuration);
}