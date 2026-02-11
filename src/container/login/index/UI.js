import React from 'react'
import {Col, Layout, Row, Spin} from 'antd'
import Ux from "ux";
import Ex from "ex";
import {Dsl} from 'entity';
import Sk from "skin";
import __ from './Cab.module.scss';
import imgBg from "./image/bg.jpg";
import imgLogo from "./image/logo.png";

const {Header, Content} = Layout;

const isReady = (reference) => {
    const {$app} = reference.state;
    if (!$app) {
        return false;
    }
    return $app.is();
}

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .loading("app")
    .connect(state => Ux.dataIn(state)
        .revamp(["app"])
        .to()
    )
    .connect({
        fnApp: Ex.epicApp
    }, true)
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.I.app().then($app => {
            const state = {};
            state.$app = Dsl.getObject($app);
            Ux.of(this).in(state).ready().done();
        }).catch(error => this.setState({error}))
    }

    render() {

        const {component: Child} = this.props;
        const {$app} = this.state;
        const ready = isReady(this);
        const title = $app ? $app._("title") : null;
        return (
            <Layout {...Sk.mix(__.hm_login, () => ({
                backgroundImage: `url(${imgBg})`
            }))}>
                <Header className="hm_header">
                    <Row>
                        <Col xl={10} xxl={10}>
                            <header>
                                <img src={imgLogo} alt={title}/>
                                <h2>{title}</h2>
                            </header>
                        </Col>
                        <Col span={8} xl={10} xxl={11}/>
                    </Row>
                </Header>
                <Content className={"content"}>
                    <Row>
                        <Col span={6} xl={7} xxl={6}/>
                        <Col span={12} xl={10} xxl={12}>
                            <Spin spinning={!ready}>
                                <Child {...this.props}/>
                            </Spin>
                        </Col>
                        <Col span={6} xl={7} xxl={6}/>
                    </Row>
                </Content>
            </Layout>
        )
    }
}

export default Component;
