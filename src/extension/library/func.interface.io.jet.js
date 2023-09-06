// =====================================================
// io 专用，in / out前缀
// =====================================================
import __Zu from 'zet';
import __Zp from 'zep';

/**
 * ## 「输入」`Ex.inApi`
 *
 * 接口处理输入
 *
 * @memberOf module:in/utter
 * @param {Object} uri 接口配置
 * @returns {Object} 处理过的接口数据
 */
const inApi = (uri = {}) =>
    __Zu.inApi(uri);
/**
 *
 * ## 「输出」`Ex.outApi`
 *
 * 接口处理输出
 *
 * @memberOf module:yo/upper
 * @param {Object} params 提交之前原始接口数据
 * @returns {Object} 接口输出数据
 */
const outApi = (params = {}) =>
    __Zp.outApi(params);

/**
 * ## 「输入」`Ex.inJob`
 *
 * 任务处理输入
 *
 * @memberOf module:in/utter
 * @param {Object} mission 任务配置
 * @returns {Object} 处理过的任务数据
 */
const inJob = (mission = {}) =>
    __Zu.inJob(mission);
/**
 *
 * ## 「输出」`Ex.outJob`
 *
 * 任务处理输出
 *
 * @memberOf module:yo/upper
 * @param {Object} params 提交之前原始任务数据
 * @returns {Object} 任务输出数据
 */
const outJob = (params = {}) =>
    __Zp.outJob(params);
/**
 * ## 「提交」`Ex.outMessage`
 *
 * 提交流程中的异常信息处理，不同执行流程的异常信息处理不同。
 *
 * ### 1. 引用查询
 *
 * - 优先考虑 reference 引用的核心异常信息提取流程。
 * - 再考虑 reference 的父引用核心异常信息提取流程。
 *
 * ### 2. 异常提取流程
 *
 * - 「ERR」若 key 不是 String 则抛出异常：
 * - 「ERR」若 `reference/ref` 中绑定的异常信息不存在，即缺少了 `_modal` 节点配置
 * - 二选一的流程
 *      - 如果 `_modal.error` 中配置了 `error=<key>` 对应节点的异常信息，则以提取配置为第一优先级。
 *      - 如果 `_modal.error` 中提取失败，则直接使用 `message=<key>`。
 *
 * 优先级的判定在于使用者根据自身实际情况配置，简单说您可以优先考虑配置项的键，其次考虑配置项的消息内容。简单说您可以按照如下优先级：
 *
 * - 若您的配置中配了内容，则直接传 key 就好。
 * - 若您的配置中没有配置任何内容，则考虑使用 key 作为消息内容（不得已而处理，或编程直接调用）。
 *
 * ### 3. 响应处理
 *
 * 响应支持两种模式：同步/异步
 *
 * - 若使用同步模式，则直接返回 String 类型的字符串消息内容。
 * - 若使用异步模式，则直接返回 Promise.reject({data: message})的Promise对象。
 *
 * @memberOf module:in/utter
 * @param reference React组件引用
 * @param {String} error 异常信息
 * @param {Boolean} async 异步还是同步
 */
const outMessage = (reference, error, async) =>
    __Zu.outMessage(reference, error, async);
/**
 * ## 「提交」`Ex.outError`
 *
 * ### 同步模式
 *
 * ```js
 * Ex.outError(reference, "xxx", { pFlow: true });
 * ```
 *
 * ### 异步模式
 * ```js
 * Ex.outError(reference, "xxx", { pAsync: true });
 * ```
 *
 * @memberOf module:in/utter
 * @param reference
 * @param error
 * @param config
 * @return {boolean}
 */
const outError = (reference, error, config) =>
    __Zp.outError(reference, error, config);
export default {
    // in / out
    inApi,
    inJob,
    outApi,
    outJob,
    // verify
    outMessage,
    outError,
}