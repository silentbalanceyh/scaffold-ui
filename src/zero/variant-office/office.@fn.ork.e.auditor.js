import __Zn from './zero.office.dependency';
// eslint-disable-next-line import/no-anonymous-default-export
export default (configuration = {}, parameters = {}) => {
    const editorConfig = configuration?.editorConfig ? configuration?.editorConfig : {};

    const user = __Zn.isLogged();
    editorConfig.user = {
        id: user.key,
        name: user.username,
    }
    return __Zn.promise(configuration);
}