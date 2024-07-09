import React from 'react';
import {Input} from "antd";

const aiHidden = (reference, jsx = {}, onChange) => {
    jsx.type = "hidden";
    return (<Input {...jsx} key={jsx.key}/>);
};
export default {
    aiHidden
}