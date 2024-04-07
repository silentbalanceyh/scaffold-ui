import * as V4Icons from '@ant-design/icons';
import __V4 from './__.v.ant4.icon.pack';
import Immutable from "immutable";
import React from 'react';

const v4Icon = (type, attrs = {}) => {
    const {
        theme = __V4.ICON_THEME.OUTLINED,  // Outlined
        ...rest
    } = attrs;
    // 二义性解析，直接支持Object模式
    let UiV4Icon;
    if ("string" === typeof type) {
        const iconKey = __V4.ICON_PREFIX[type] + theme;
        // Extract the correct Icon
        UiV4Icon = V4Icons[iconKey];
        if (UiV4Icon) {
            const $rest = Immutable.fromJS(rest).toJS();
            // 防止递归问题
            if ($rest.type) delete $rest.type;

            // onClick 注入
            if(attrs.onClick){
                $rest.onClick = attrs.onClick;
            };
            return (<UiV4Icon {...$rest}/>)
        } else return false;
    } else {
        if(type && type.$$typeof){

            // onClick 注入
            if(type.props && attrs.onClick){
                return React.cloneElement(type, {onClick: attrs.onClick});
            }else{
                return type;
            }
        }
        return v4Icon(type.type, type);
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    v4Icon,
}
