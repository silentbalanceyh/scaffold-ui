import React from 'react';
import {Empty, Timeline} from "antd";
import Ux from 'ux';

const componentInit = (reference) => {
    const {data = []} = reference.props;
    if (0 === data.length) {
        Ux.of(reference).ready().done();
    } else {
        const state = {};
        const userId = data.map(item => item.createdBy);
        Ux.ajaxPost("/api/user/search", {
            criteria: {
                "key,i": userId
            }
        }).then(users => {
            const {list = []} = users;
            const $lazy = {};
            list.forEach(each => $lazy[each.key] = each.realname);
            state.$lazy = $lazy;
            Ux.of(reference).in(state).ready().done();
            // reference.?etState(state);
        })
    }
}

class ApprovalComponent extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ux.xtRender(this, () => {
            const {data = []} = this.props;
            if (0 === data.length) {
                return (<Empty/>)
            } else {
                const {$lazy = {}} = this.state;
                const items = [];
                data.forEach(history => {
                    const item = {};
                    item.key = history.key;
                    const timeAt = Ux.valueDatetime(history['createdAt']);
                    const name = $lazy[history.createdBy];
                    item.children = (
                        <>
                            <p>{name}，{timeAt.format("YYYY-MM-DD HH:mm:ss")}</p>
                            <p>{history.description}</p>
                        </>
                    );
                    items.push(item);
                })
                return (
                    <Timeline items={items}/>
                )
            }
        });
    }
}

export default (reference) => ($inited, config = {}) => {
    /*
     * $openAppr / $openFile
     */
    const {history = []} = $inited;
    const approvals = history.filter(each => "APPROVAL" === each.type)
        .sort(Ux.sorterDescDFn('createdAt'));
    return (<ApprovalComponent data={approvals}/>);
}