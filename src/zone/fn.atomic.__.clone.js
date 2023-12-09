import __Is from './fn.under.is.decision';
import dayjs from "dayjs";
import Immutable from "immutable";
const __cloneSet = (input, deeply = false) => {
    const vSet = new Set();
    Array.from(input).forEach(item => {
        if(deeply){
            vSet.add(__cloneValue(item, deeply));
        }else{
            vSet.add(item);
        }
    });
    return vSet;
}
const __cloneArray = (input, deeply = false) => {
    const vArray = [];
    input.forEach(item => {
        if(deeply){
            vArray.push(__cloneValue(item, deeply));
        }else{
            vArray.push(item);
        }
    });
    if(input.__acl){
        vArray.__acl = input.__acl;
    }
    return vArray;
}
const __cloneObject = (input, deeply = false) => {
    let vObject;
    // 没有循环引用，直接拷贝
    try{
        vObject = Immutable.fromJS(input).toJS();
    }catch (error){
        vObject = {};
        Object.keys(input).forEach(field => {
            if(field.startsWith("$")){
                vObject[field] = __cloneValue(input[field], deeply);
            }else{
                vObject[field] = input[field];
            }
        });
    }
    return vObject;
}
const __cloneCollection = (input,  deeply = false) => {
    // Set / Array
    if(__Is.isSet(input)){
        return __cloneSet(input, deeply);
    }
    if(__Is.isArray(input)){
        return __cloneArray(input, deeply);
    }
    throw new Error("数据结构在拷贝时判断异常！", input);
}
/*
 * 拷贝专用的新方法，实现各种拷贝的详细流程，比较特殊的情况就是
 * 1. 如果是纯的 Object 类型，则需要递归执行 key = value 的拷贝
 * 2. 如果是纯的 Array 类型，则要递归执行每个元素 element 的拷贝
 */
const __cloneValue = (input, deeply = false) => {
    // - null, undefined 检查，如果的是，直接返回
    if(__Is.isNull(input)){
        return input;
    }
    // - Function 检查，如果是，则直接返回
    if(__Is.isFunction(input)){
        return input;
    }
    // - DayJs
    if(__Is.isMoment(input)){
        return dayjs(input);
    }
    // - T Entity
    if(__Is.isTEntity(input)){
        return input;
    }
    // - NodeList
    if(__Is.isNodeList(input)){
        return input;
    }
    // - Set / Array
    if(__Is.isCollection(input)){
        return __cloneCollection(input, deeply);
    }
    // - Object
    if(__Is.isObject(input)){
        return __cloneObject(input, deeply);
    }
    // - Number / Boolean / String
    return input;
}
export default __cloneValue;