import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import {Button, Space} from "antd";
import React from "react";
import Op from './Op';

// eslint-disable-next-line import/no-anonymous-default-export
export default (reference) => {
    const {
        $actions = {}, $step = 0, $stepConfig = [],
        $submitting = false
    } = reference.state;
    return (
        // FIX: Warning: [antd: Button.Group] `Button.Group` is deprecated. Please use `Space.Compact` instead. Error Component Stack
        <Space.Compact>
            <Button disabled={0 === $step || $step === ($stepConfig.length - 1)}
                    loading={$submitting}
                    onClick={Op.onPrev(reference)}>
                <LeftOutlined/>
                {$actions.prev}
            </Button>
            <Button type={"primary"}
                    disabled={$step === ($stepConfig.length - 1)}
                    loading={$submitting}
                    onClick={Op.onNext(reference)}>
                {$actions.next}
                <RightOutlined/>
            </Button>
        </Space.Compact>
    );
}