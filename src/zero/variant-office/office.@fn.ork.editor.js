import __Zn from './zero.office.dependency';
import orkMode from './office.@fn.ork.e.mode';
import orkEmbed from './office.@fn.ork.e.embed';
import orkAuditor from './office.@fn.ork.e.auditor';
// eslint-disable-next-line import/no-anonymous-default-export
export default (configuration = {}, parameters = {}) => {
    const editorConfig = configuration?.editorConfig ? configuration?.editorConfig : {};
    if (!editorConfig.customization) {
        editorConfig.customization = {};
    }

    // editorConfig.lang = "zh-CN";
    if (__Zn.Env.LANGUAGE) {
        let lang = __Zn.Env.LOCALE_DOC[__Zn.Env.LANGUAGE];
        if (lang) {
            editorConfig.lang = lang;
        }
    }

    // editorConfig.uiTheme
    if (__Zn.Env.DOC_THEME) {
        editorConfig.customization.uiTheme = __Zn.Env.DOC_THEME;
    } else {
        editorConfig.customization.uiTheme = "theme-light";
    }

    configuration.editorConfig = editorConfig;
    return __Zn.promise(configuration)
        // pView = true
        .then(configData => orkMode(configData, parameters))
        // pEmbed = true
        .then(configData => orkEmbed(configData, parameters))
        // user 对象中设置 editorConfig.user
        .then(configData => orkAuditor(configData, parameters))
}