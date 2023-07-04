import React from 'react';
import {Menu} from 'antd';
import Event from '../event';

export default (reference) => {
    const {$menus = [], $condMenu} = reference.state;
    const items = [];
    $menus.forEach(menu => {
        const fnCounter = menu.__counter;
        const item = {};
        item.key = menu.key;
        item.children = (
            <span>
                {menu.text}（{fnCounter(reference)}）
            </span>
        )
        items.add(item);
    })
    return (
        <Menu onSelect={Event.onSelected(reference)}
              className={"job-menu"}
              selectedKeys={$condMenu} items={items}/>
    )
}