import Ex from 'ex';
import Ux from 'ux';

const requestData = (params = {}, subscriptions = {}) => {
    const configInternal = {};
    const configEmail = {};
    const configSms = {};
    Object.keys(subscriptions).forEach(field => {
        const value = subscriptions[field];
        if(value) {
            const enabled = params[field];
            if (field.startsWith("email")) {
                // 邮件设置
                configEmail[value] = !!enabled;
            } else if (field.startsWith("sms")) {
                // 短信设置
                configSms[value] = !!enabled;
            } else {
                // 消息设置
                configInternal[value] = !!enabled;
            }
        }
    })
    return { configInternal, configEmail, configSms };
}

const initData = (notification = {}, subscriptions = {}) => {
    const data = {};
    const { configInternal = {}, configEmail = {}, configSms = {}} = notification;
    const configuration = {};
    Object.assign(configuration, configInternal, configEmail, configSms);
    Object.keys(subscriptions).forEach(field => {
        const value = subscriptions[field];
        if(configuration.hasOwnProperty(value)){
            data[field] = !!configuration[value];
        }else{
            // 没有定制的默认值都为 true（打开）
            data[field] = true;
        }
    })
    return data;
}
export default {
    yiPage: (reference) => {
        const state = {};
        Ex.yiStandard(reference, state).then(response => {
            const user = Ux.isLogged();
            const setting = user?.setting ? user.setting : {};
            const { notification = {}} = setting;
            Object.assign(state, response);

            const { $hoc } = response;
            if($hoc){
                const module = $hoc._("module");
                const { $options = {}} = module;
                const subscriptions = $options.subscriptions;
                state.$inited = initData(notification, subscriptions);
            }
            Ux.of(reference).in(state).done();
        })
    },
    actions: {
        $opSave: (reference) => (params) => {
            const request = {};
            {
                const { $options = {}} = reference.props;
                const subscriptions = $options.subscriptions;
                const configData = requestData(params, subscriptions);
                Object.assign(request, configData);
            }
            const user = Ux.isLogged();
            return Ux.ajaxPut("/api/my/notify/:key", { key: user.key, $body: request })
                .then(response => Ux.ajaxDialog(reference, {data: response, key: "saved"}))
                .then(stored => {
                    const user = Ux.isLogged();
                    if(!user.setting){
                        user.setting = {};
                    }
                    user.setting.notification = stored;
                    Ux.storeUser(user);
                })
        }
    }
}