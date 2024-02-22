import Ux from 'ux';
import {Row, Col} from "antd";
import React from 'react';
/*
 * Fix: JavaScript 浮点数在加法的时候会出现精度问题，是因为 JavaScript 中的数字按照 IEEE 754 的标准
 * 使用 64 位双精度浮点型来表示1。这样会导致一些无法用有限的二进制位精确表示的十进制小数，在转换成二进制的过程中产生误差2。
 * 防止：535.83 -> 535.8299999999999 的情况发生
 */
const valueAmount = (data = []) => {
    let amount = 0;
    data.forEach(item => {
        if(item.income){
            amount += (item.amount * 100);
        }else{
            amount -= (item.amount * 100);
        }
    })
    return amount / 100;
}

const EXECUTOR = {
    SUM_C_ALL: (data = []) => data.length,                                              // 总数量
    SUM_C_FINISHED: (data = []) => data.filter(item => !!item.finishedId).length,       // finishedId 有值
    SUM_A_ALL: (data = []) => valueAmount(data),                                        // 总金额
    SUM_A_FINISHED: (data = []) => valueAmount(data.filter(item => !!item.finishedId)), // 完成总额
    SUM_A_PROCESS: (data = [], reference) => {
        const { $selectedKeys = []} = reference.props;
        const items = data.filter(item => $selectedKeys.includes(item.key));
        return valueAmount(items);
    }
}
export default {
    /*
     * 计算返回对应的值：
     * label：标签
     * value：计算的值，分别对应：总数量、已完成数量、总金额、完成总额、本次结算额
     * className：fm_item_ / ( blue | green | red )
     */
    reportFooter: (reference, data = []) => {
        const report = Ux.inHoc(reference, "report");
        return (
            <Row>
                {report.map(config => {
                    const executor = EXECUTOR[config.executor];
                    if(Ux.isFunction(executor)){
                        const valueExpr = Ux.formatExpr(config.value, { value: executor(data, reference) });
                        return (
                            <Col key={config.executor}
                                 span={config.span ? config.span: 5}>
                                {config.label}：
                                <span className={config.className}>{valueExpr}</span>
                            </Col>
                        )
                    }else{
                        return (<span>{config.executor} 异常</span>)
                    }
                })}
            </Row>
        )
    }
}