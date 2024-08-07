import Ux from 'ux';
import Ex from 'ex';
import {Row, Col} from "antd";
import React from 'react';

const EXECUTOR = {
    SUM_C_ALL: (data = []) => data.length,                                              // 总数量
    SUM_C_FINISHED: (data = []) => data.filter(item=>item.finishedId===undefined).filter(item=>item.debtId===undefined).length,       // finishedId 有值
    SUM_A_ALL: (data = []) => Ex.paySum(data),                                        // 总金额
    SUM_A_FINISHED: (data = []) => Ex.paySum(data.filter(item=>item.finishedId===undefined).filter(item=>item.debtId===undefined)), // 完成总额
    SUM_A_PROCESS: (data = [], reference) => {
        const { $selectedKeys = []} = reference.props;
        const items = data.filter(item => $selectedKeys.includes(item.key));
        return Ex.paySum(items);
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