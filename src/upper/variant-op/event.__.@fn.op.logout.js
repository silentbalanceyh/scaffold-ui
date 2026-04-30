import Ux from "ux";
import {_I} from 'zet';

// eslint-disable-next-line import/no-anonymous-default-export
export default (reference) => {
    return _I.logout()
        .then(item => Ux.DevTool(reference).clean(item))
        .then(result => {
            // console.info("登出系统！", result);
            // 路由处理
            Ux.toRoute(reference, Ux.Env.ENTRY_LOGIN, {mid: null, pid: null});
            // 清除Session
            Ux.toLogout();
            // 清除State上的数据
            Ux.writeClean(reference, ['user']);
        }).catch(error => Ux.ajaxError(reference, error));
}