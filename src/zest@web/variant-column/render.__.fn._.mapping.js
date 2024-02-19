import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';

const Cmn = {
    ...__JSX,
    ...__NORM,
}

const renderItem = (value, params = {}) => {
    const {
        parsed = {},
        attrs = {},
        record = {},
        column = {}
    } = params;
    const attrsCopied = __Zn.clone(attrs);
    let item = parsed[value];                                            // 1. 根据值提取 item
    if (!item) item = {};
    const normalizedIcon = Cmn.normIcon(item);                           // 2. icon 的规范化
    const normalizedText = Cmn.normText(item.text, column, record);      // 3.格式化文字
    if (__Zn.isDiff(attrsCopied.style, item.style)) {                    // 4.合并 item 中的
        attrsCopied.style = item.style;
    }
    return Cmn.jsxIcon(attrsCopied, normalizedText, normalizedIcon);
}
export default {
    MAPPING: (reference, column) => {
        let attrs = Cmn.normInit(column);                                          // -1. 风格可静态化
        const {$mapping = {}} = column;
        // -2. 静态部分，先解析 $mapping 并且只解析一次
        const parsed = {};
        Object.keys($mapping)
            .forEach(key => {
                let processed = key;
                if (0 < key.indexOf('`')) {
                    // valueLadder 中符号冲突, 1）.号需要转换成 ` 来处理 literal 中的值, 2）因为值中可能包含 . 号
                    const reg = new RegExp("`", "g");
                    processed = key.replace(reg, '.');
                }
                parsed[processed] = __Zn.aiExprIcon($mapping[key]);
            });
        return (originalText, record) => {
            /**
             * 将 MAPPING 映射修改成可以直接支持批量模式
             * originalText 可能是数组，也可能是单值
             */
            const params = {};
            params.parsed = parsed;
            params.attrs = attrs;
            params.column = column;
            params.record = record;
            if (__Zn.isArray(originalText)) {
                return originalText.map(itemText => (
                    <span key={itemText}>
                        {renderItem(itemText, params)}
                    </span>
                ));
            } else {
                return renderItem(originalText, params);
            }
        }
    },
}