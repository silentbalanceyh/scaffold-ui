import Ux from 'ux';

export default (configuration = {}, data = {}, reference) => {
    const editorConfig = {};

    // editorConfig.lang = "zh-CN";
    if (Ux.Env.LANGUAGE) {
        let lang = Ux.Env.LOCALE_DOC[Ux.Env.LANGUAGE];
        if (lang) {
            editorConfig.lang = lang;
        }
    }

    // editorConfig.uiTheme
    if (Ux.Env.DOC_THEME) {
        editorConfig.uiTheme = Ux.Env.DOC_THEME;
    } else {
        editorConfig.uiTheme = "theme-light";
    }

    configuration.editorConfig = editorConfig;
    return Ux.promise(configuration);
}