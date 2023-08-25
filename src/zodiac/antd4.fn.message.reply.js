import __Zn from './zero.module.dependency';

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
export default {
    messageSuccess,
    messageFailure,
    messageCatch,
    messageConfirm
}
