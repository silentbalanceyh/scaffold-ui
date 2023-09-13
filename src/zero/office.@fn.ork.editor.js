import __Zn from './zero.module.dependency';

// eslint-disable-next-line import/no-anonymous-default-export
export default (configuration = {}, parameters = {}) => {
    const editorConfig = configuration.editorConfig ? configuration.editorConfig : {};

    // editorConfig.lang = "zh-CN";
    if (__Zn.Env.LANGUAGE) {
        let lang = __Zn.Env.LOCALE_DOC[__Zn.Env.LANGUAGE];
        if (lang) {
            editorConfig.lang = lang;
        }
    }

    // editorConfig.uiTheme
    if (__Zn.Env.DOC_THEME) {
        editorConfig.uiTheme = __Zn.Env.DOC_THEME;
    } else {
        editorConfig.uiTheme = "default-light";
    }

    configuration.editorConfig = editorConfig;
    return __Zn.promise(configuration);
}