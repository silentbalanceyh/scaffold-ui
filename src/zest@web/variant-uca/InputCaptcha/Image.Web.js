import React from 'react';
import { Spin } from 'antd';
import Op from './Image.Op';
import Cmn from './Op.Common';
import __Zn from '../zero.uca.dependency';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 渲染
    render: (reference) => {
        const { $image, $imageLoading = false } = reference.state;
        if (!$image) {
            return false;
        }
        return (
            <div className={"captcha"} onClick={Op.rxImage(reference)}>
                <Spin spinning={$imageLoading}>
                    {/* eslint-disable-next-line */}
                    <img src={$image} alt={"captcha"} />
                </Spin>
            </div>
        )
    },
    // 初始化
    initialize: (reference, config) => {
        const state = {};
        const { $session } = reference.props;
        // Initialized Session When Enable Captcha
        Op.asyncImage(config, $session, reference).then(response => {
            state.$image = response.image;
            state.$captchaId = response.captchaId;

            // 将 captchaId 同步到父组件表单
            const { reference: parentRef } = reference.props;
            if (parentRef && parentRef.formRef && parentRef.formRef.current) {
                parentRef.formRef.current.setFieldsValue({
                    captchaId: response.captchaId
                });
            }

            __Zn.of(reference).in(state).ready().done();
            // reference.?etState(state);
            // state.$ready = true;
        }).catch(Cmn.rxError(config, reference))
    },
    // 更新
    refresh: (reference, virtual) => {
        const current = reference.props.$session;
        const previous = virtual.props.$session;
        if (previous && current && previous !== current) {
            Op.rxRefresh(reference);
        }
    }
}