import __Zn from './zero.module.dependency';
import __Store from './store.fn.is.configuration';

const messageConfirm = (content, onOk, width = 600) => {
    const md = __Zn.v4Modal()
    md.confirm({
        content,
        width,
        onOk
    })
};
const ID_MSG_SUCCESS = "ZERO_MSG_SUCCESS";
const ID_MSG_FAILURE = "ZERO_MSG_FAILURE";
const ID_NOTIFY_INFO = "ZERO_NOTIFY_INFO";
const messageSuccess = (content = "", duration = 1.628) => {
    if ("string" === typeof content) {
        const ms = __Zn.v4Message();
        ms.destroy(ID_MSG_SUCCESS);
        ms.success({
            key: ID_MSG_SUCCESS,
            content
        }, duration);
    } else if (__Zn.isObject(content)) {
        const {modal: {success = {}}} = content;
        /*
         * 递归调用
         */
        if ("string" === typeof success.content) {
            messageSuccess(success.content);
        }
    } else {
        console.warn("[ Ux ] 没有被显示的成功消息：", content);
    }
};

const messageFailure = (content = "", duration = 1.628) => {
    if ("string" === typeof content) {
        const ms = __Zn.v4Message();
        ms.destroy(ID_MSG_FAILURE);
        ms.error({
            key: ID_MSG_FAILURE,
            content,
        }, duration);
    } else if (__Zn.isObject(content)) {
        const {modal} = content;
        /*
         * 递归调用
         */
        const {error = {}} = modal ? modal : {};
        if ("string" === typeof error.content) {
            messageFailure(error.content);
        }
    } else {
        console.warn("[ Ux ] 没有被显示的失败消息：", content);
    }
};

const messageCatch = (error = {}, callbackFn) => {
    const {data = {}} = error;
    // console.error(error);   // 调试专用
    if (data.info) {
        messageFailure(data.info, 2);
    } else {
        if (data.message) {
            messageFailure(data.message, 2);
        }
    }
    if (__Zn.isFunction(callbackFn)) {
        callbackFn();
    }
};
// ------ 提醒专用
const __notifyMessage = (config = {}, type, onClose) => {
    const { message, description, placement = "topRight", style = {width: 480} } = config;
    const notify = __Zn.v4Notify();
    const configData = {
        message,
        description,
        placement,
        style,
        key: ID_NOTIFY_INFO,
    }
    if(__Zn.isFunction(onClose)){
        configData.onClose = onClose;
    }
    const name = type;
    if(__Zn.isFunction(notify[name])){
        notify.destroy(ID_NOTIFY_INFO);
        notify[name](configData);
    }else{
        console.error("未找到对应通知类型：", name);
    }
}
const notifyRequest = (response = {}, callbackFn) => {
    const {
        subject, content,
        status, type,
        messageId
    } = response;
    /*
     * name, code = messageId
     * type = type
     * status = status
     * subject = subject
     * content = content
     * sendFrom, appId = appId
     * sendTo = userId
     * sendBy = app.name
     */
    const request = {
        name: messageId,
        code: messageId,
        type,
        status,
        subject,
        content
    };
    const app = __Store.isInit();
    if(app){
        request.appId = app.key;
        request.sendBy = app.key;
        request.sendFrom = app.name;
    }
    const user = __Store.isLogged();
    if(user){
        request.sendTo = user.key;
    }
    if(__Zn.isFunction(callbackFn)){
        return callbackFn(request);
    }else {
        return request;
    }
}
export default {
    messageSuccess,
    messageFailure,
    messageCatch,
    messageConfirm,
    notifyInfo: (config, onClose) => __notifyMessage(config, "info", onClose),
    notifySuccess: (config, onClose) => __notifyMessage(config, "success", onClose),
    notifyWarning: (config, onClose) => __notifyMessage(config, "warning", onClose),
    notifyError: (config, onClose) => __notifyMessage(config, "error", onClose),
    notifyRequest,
}
