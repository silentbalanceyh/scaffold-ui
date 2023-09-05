import __Zn from './zero.module.dependency';
import __OP from './uca.fn.xt.op.primary';

const xtRowChange = (reference, rowKey, field) => (event) => {
    let {value = []} = reference.props;
    if (__Zn.isArray(value) && rowKey && field) {
        value = __Zn.clone(value);
        const fieldValue = __Zn.ambEvent(event);
        value.forEach(each => {
            if (rowKey === each.key) {
                each[field] = fieldValue;
            }
        });
        __Zn.fn(reference).onChange(value);
    }
}
// --------------------------- 下边是新版本事件 -----------------------------
/*
 * 此处数据提取会根据配置的格式去提取当前组件中的 value 信息，此处是设计上的事务，早期的
 * format 希望的数据结构如：
 * {
 *     "type": "ARRAY",
 *     "keyField": "key"
 * }
 * 本着初期的想法是支持五种数据格式，而目前只使用了两种，所以外层事件就不判断，而内层 xtGet / xtSet
 * 依旧保留了这种设计，所以此处的 xtGet 会根据 format 的配置去提取数据。
 */
const xtRowAdd = (reference, record, index) => (event) => {
    __Zn.prevent(event);
    // 提取数据
    const data = __OP.xtGet(reference);
    if (__Zn.isArray(data)) {
        /*
         * 此处分支：format.type = ARRAY，数组类型
         * 此处的 splice 会有副作用，直接更改原始的数组
         */
        data.splice(index + 1, 0, {key: __Zn.randomUUID()});
        // reference.?etState({data});
        return __Zn.of(reference).in({data})
            .future(() => __Zn.promise(data));
    } else {
        // 暂定其他类型返回 null
        return __Zn.promise(null);
    }
}

const xtRowDel = (reference, record, index) => (event) => {
    __Zn.prevent(event);
    let data = __OP.xtGet(reference);
    if (__Zn.isArray(data)) {
        /* 直接移除当前索引位置的数据 */
        let combine = [];
        if (1 === data.length) {
            const item = {};
            item.key = data[0].key;
            if (!item.key) {
                item.key = __Zn.randomUUID();
            }
            combine = [item];
        } else {
            data = data.filter((item, itemIdx) => !(record.key === item.key && itemIdx === index));
            combine = data;
        }
        return __Zn.of(reference).in({data: combine})
            .future(() => __Zn.promise(combine));
        // reference.?etState({data: merged});
    } else {
        // 暂定其他类型返回 null
        return __Zn.promise(null);
    }
}

export default {
    xtRowAdd,
    xtRowDel,
    xtRowChange,
}