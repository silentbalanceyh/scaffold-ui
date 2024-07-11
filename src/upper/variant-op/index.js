import $opLogin from './event.__.@fn.op.login';
import $opLogout from './event.__.@fn.op.logout';

import $opLoginSMS from './event.__.@fn.op.login-sms';

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