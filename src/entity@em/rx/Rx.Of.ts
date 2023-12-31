// @ts-ignore
import __Zn from '../zero.module.dependency'

/*
 * 读取配置文件信息
 * {
 *      "_modal": {
 *          "success":{
 *              "key": "..."
 *          },
 *          "failure":{
 *              "key": "..."
 *          },
 *          "confirm":{
 *              "key": "..."
 *          }
 *      }
 * }
 * 回调模式
 * 1. 直接 Dialog 成功返回
 * 2. 直接 Message 成功返回
 * 3. 使用 Confirm ( Prompt ) 过后调用 Message 返回
 *
 * 异常数据格式处理
 */
class Of {
    private _reference: any;
    private _promise: any;
    private _ui: any = {};
    private _callback: any = {};
    private _message: Boolean = false;

    private constructor(reference: any) {
        this._reference = reference;
    }

    static from(reference) {
        if (!reference) {
            throw new Error("对不起，Of 对象必须传入 React 组件和它绑定！");
        }
        return new Of(reference)
    }

    bind(promise): Of {
        this._promise = promise;
        return this;
    }

    message(): Of {
        /*
         * 是否使用 message，注，调用该方法过后，后台使用 message 处理
         */
        this._message = true;
        return this;
    }

    prompt(message: any): Of {
        /*
        * 处理消息（先根据消息提取 confirm 信息
        * */
        this._ui.prompt = message;
        this._message = true;
        return this;
    }

    ko(callback: Function): Of {
        this._callback.failure = callback;
        return this;
    }

    ok(callback: Function): Of {
        this._callback.success = callback;
        return this;
    }

    async(params: any = {}): any {
        return this.to(params ? params : {})
    }

    to(params: any = undefined): any {
        const promise = this._promise;
        const reference = this._reference;
        const callback = this._callback;
        const executor = values => {
            /*
             * 是否包含了 prompt
             */
            return promise(values)
                .then(response => {
                    if (__Zn.isFunction(callback.success)) {
                        /*
                         * 回调处理
                         * 1）第一种回调是 success 是一个 promise，执行完成过后，调用 then 方法来执行后续操作
                         * 2）第二种回调是 success 是一个纯函数 Function，执行完成后返回 {}，就触发 setState 操作
                         **/
                        const returned = callback.success(response, values);
                        if (Promise.prototype.isPrototypeOf(returned)) {
                            return returned.then(updated => {
                                __Zn.of(reference).in(updated).load().done()
                                // reference.?etState({
                                //     ...updated,
                                //     $loading: false,
                                //     $submitting: false
                                // });
                            });
                        } else {
                            const merged = __Zn.isObject(returned) ? returned : {};
                            if (__Zn.isObject(returned)) {
                                __Zn.of(reference).in(merged).load().done()
                                // reference.?etState({
                                //     ...merged,
                                //     $loading: false,
                                //     $submitting: false
                                // });
                            }
                            // return callback.success(response, values);
                        }
                    } else {
                        throw new Error("Sorry, you must set `success` Function！");
                    }
                })
                .catch(error => {
                    let returned;
                    return __Zn.of(reference).load().future(() => {
                        if (__Zn.isFunction(callback.failure)) {
                            returned = callback.failure(error, values);
                            if (returned instanceof Promise) {
                                return returned.then(() =>
                                    __Zn.ajaxError(reference, error))
                            } else return __Zn.ajaxError(reference, error);
                        } else return __Zn.ajaxError(reference, error);
                    })
                    // reference.?etState({
                    //     $loading: false,
                    //     $submitting: false
                    // });
                    // if (__Zn.isFunction(callback.failure)) {
                    //     returned = callback.failure(error, values);
                    //     if (returned instanceof Promise) {
                    //         return returned.then(() =>
                    //             __Zn.ajaxError(reference, error))
                    //     } else return __Zn.ajaxError(reference, error);
                    // } else return __Zn.ajaxError(reference, error);
                })
        }
        if (params) {
            /*
             * 有参数返回执行结果
             */
            return executor(params);
        } else {
            /*
             * 无参数返回函数
             */
            return executor;
        }
    }
}

export default Of;