import $opLogin from './event.__.@fn.op.login';
import $opLogout from './event.__.@fn.op.logout';

import $opLoginSMS from './event.__.@fn.op.login-sms';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /**
     * @memberOf module:fixed/upper
     * @constant Op
     * @type {Object}
     */
    Op: {
        $opLogin,
        $opLogout,
        $opLoginSMS,
    }
}