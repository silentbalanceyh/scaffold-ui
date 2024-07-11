import __Zn from '../zero.uca.dependency';
import {Button, Statistic} from "antd";
import Op from './Sms.Op';
import dayjs from "dayjs";

const {Countdown} = Statistic;
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    render: (reference) => {
        const {config = {}, $message = false} = reference.props;
        if ($message) {
            // 正在发送
            const format = config.button.waiting;
            const seconds = dayjs().add(10, 'second')
            return (
                <div className={"sms"}>
                    <Button disabled>
                        <Countdown value={seconds}
                                   onFinish={Op.rxFinish(reference)}
                                   format={format ? format : "ss"}/>
                    </Button>
                </div>
            )
        } else {
            // 可以点击
            const buttonText = config.button.text;
            return (
                <div className={"sms"}>
                    <Button onClick={Op.rxClick(reference)}>{buttonText}</Button>
                </div>
            )
        }
    },
    initialize: (reference, config) => {
        // 是否显示同意按钮
        const state = {};
        __Zn.of(reference).in(state).ready().done();
    },
    refresh: (reference, virtual) => {

    }
}