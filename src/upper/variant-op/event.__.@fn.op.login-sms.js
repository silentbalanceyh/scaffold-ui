import Ux from 'ux';
import {_I} from "zet";

// eslint-disable-next-line import/no-anonymous-default-export
export default (reference) => {
    return (params) => {
        const {$message = false} = reference.state;
        if (!$message) {
            // 验证码过期
            return Ux.ajaxReject(reference, "waiting");
        }
        /*
         * mUsername
         * mMessage
         */
        const headers = {};
        const {$session} = reference.state ? reference.state : {};
        if ($session) {
            headers[Ux.Env.X_HEADER.X_SESSION] = $session;
        }
        const request = {};
        request.mobile = params.mUsername;
        request.message = params.mMessage;
        return Ux.ajaxPush("/mobile/login", request, {headers})
            .then((response = {}) => {
                // 读取Token信息
                const user = {};
                user.token = response['access_token'];
                user.refreshToken = response['refresh_token'];
                user.key = response.key;
                user.username = params.username;
                return Ux.promise(user);
            })
            .then((user = {}) => {
                /* 存储用户信息 */
                Ux.storeUser(user);
                /* 先存储一份用户数据，后续请求需要拿 token */
                return Ux.promise(user);
            })
            /* 直接读取员工信息 */
            .then(() => _I.user())
            .then(employee => {
                const user = Ux.isLogged();
                const logged = Object.assign(Ux.clone(user), employee);
                return Ux.promise(logged);
            })
            .then(logged => {
                // 读取 rxLogin ：外层传入
                const {rxLogin} = reference.props;
                if (Ux.isFunction(rxLogin)) {
                    return rxLogin(logged);
                } else {
                    return Ux.promise(logged);
                }
            })
            .then(logged => {
                /* Redux防重复提交完成 */
                Ux.writeSubmit(reference, false);
                /* 第二次存储 */
                Ux.storeUser(logged);
                Ux.toOriginal(reference);
            })
            .catch(error => {
                // 特殊流程（一旦登录失败刷新验证码）
                if ($session) {
                    error.callback = () => {
                        const session = Ux.randomString(48);
                        Ux.of(reference).in({
                            $session: session
                        }).done();
                    }
                }
                return Promise.reject(error);
            });
    }
}