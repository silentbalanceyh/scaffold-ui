import __Zn, {_Ant} from './zero.uca.dependency';
import React from 'react';
import {Tag} from 'antd';
const Cv = __Zn.Env;

const jsxItems = (text, config, reference) => {
    const options = _Ant.toOptions(reference,config);
    if(0 >= options.length){
        return false;
    }
    const value = text ? text: options[0]?.value;
    const option = __Zn.elementUnique(options, 'value', value);
    return (
        <Tag style={{
            fontSize: 14
        }} color={option.value}>
            {option.label}
        </Tag>
    )
}
export default {
    TAG: (reference, column = {}) => {
        const $config = column[Cv.K_NAME.CONFIG] ? column[Cv.K_NAME.CONFIG] : {};
        return (text) => {
            // $empty
            const items = $config?.items;
            if(items){
                return jsxItems(text, $config);
            }else{
                // 旧版先维持
                if (text) {
                    const {size = 24} = $config;
                    // tag:xxx
                    // icon
                    if (text.startsWith("tag:")) {
                        const key = text.split(":")[1];
                        const image = Cv.TAG[key];
                        return (
                            <img src={image} style={{
                                width: size,
                                height: size,
                            }} alt={text}/>
                        )
                    } else {
                        return __Zn.v4Icon(text, {
                            style: {fontSize: size}
                        });
                    }
                } else return column[Cv.K_NAME.EMPTY];
            }
        };
    },
}