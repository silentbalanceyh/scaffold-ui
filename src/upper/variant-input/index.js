import login_username from './field.__.@fn.login.username';
import login_password from './field.__.@fn.login.password';
import login_captcha from './field.__.@fn.login.captcha';
import login_message from './field.__.@fn.login.message';

import address_region_id from './field.__.@fn.address.regionid';

import pay_amount from './field.__.@fn.pay.amount';
import pay_amountGap from './field.__.@fn.pay.amountGap';
import pay_amountView from './field.__.@fn.pay.amountView';
import pay_items from './field.__.@fn.pay.items';
import pay_payment from './field.__.@fn.pay.payment';
import pay_rounded from './field.__.@fn.pay.rounded';
import pay_finishType_fn from './field.__.@@fn.pay.finishType';

import Ux from 'ux';

export default {

    /**
     * @memberOf module:fixed/upper
     * @constant Jsx
     * @type {Object}
     */
    Jsx: {
        PayFn: (ref, required) => ({
            // 二阶
            finishType: pay_finishType_fn(ref, required),
            // 一阶
            payment: pay_payment,
            rounded: pay_rounded,
            items: pay_items,
            // 一阶：金额部分
            amount: pay_amount,
            amountGap: pay_amountGap,
            amountView: pay_amountView,
        }),
        /*
         * ## 登录专用类
         *
         * ### 1. 基本说明
         *
         * 登录专用类，用于渲染 username / password，注入键盘事件
         *
         * * 给 `username` 和 `password` 设置键盘事件。
         * * 在输入过程中，使用回车触发提交操作。
         *
         * ### 2. 调用代码示例
         *
         * ```js
         * // 非法处理
         * const login = new Login();
         *
         * // 合法处理（框架内部代码）
         * import Ux from 'ex';
         * import Ex from 'ex';
         *
         * &#64;Ux.zero(Ux.rxEtat(require('./Cab.json'))
         *      .cab("ExLogin")
         *      .form().raft(1).raft(Ex.Jsx.Login)
         *      .bind(Ex.Op)
         *      .to()
         * )
         * ```
         *
         * ### 3. 特殊说明
         *
         * * 触发按钮的ID为`$opLogin`，该ID为特定ID。
         *
         */
        Login: {
            username: login_username,
            password: login_password,
            captcha: login_captcha,
        },
        LoginSMS: {
            mUsername: login_username,
            mCaptcha: login_captcha,
            mMessage: login_message,
            mAgree: Ux.aiCheckbox,
        },
        /*
         * 常用地址选择（带Linker）
         */
        Address: {
            regionId: address_region_id,
        }
    }
}