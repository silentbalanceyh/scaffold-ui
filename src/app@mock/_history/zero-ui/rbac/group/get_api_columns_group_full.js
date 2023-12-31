export default {
    mock: true,
    data: [
        {
            "title": "用户组编号",
            "dataIndex": "code",
            "sorter": true,
            "$filter.type": "SEARCH",
            "$filter.config": {
                "placeholder": "输入用户组编码",
                "button": {
                    "search": "搜索",
                    "reset": "重置"
                }
            }
        },
        {
            "title": "用户组名称",
            "dataIndex": "name",
            "sorter": true,
            "$filter.type": "SEARCH",
            "$filter.config": {
                "placeholder": "输入用户组名称",
                "button": {
                    "search": "搜索",
                    "reset": "重置"
                }
            }
        },
        {
            "title": "是否启用",
            "dataIndex": "active",
            "sorter": true,
            "$render": "LOGICAL",
            "$mapping": {
                "true": "启用",
                "false": "禁用"
            },
            "$filter.config.dataType": "BOOLEAN",
            "$filter.config.items": [
                "true,启用",
                "false,禁用"
            ],
            "$filter.config.button": {
                "yes": "确认",
                "reset": "重置"
            },
            "$filter.config.width": {
                "radio": 110,
                "button": 55
            }
        },
        {
            "title": "创建人",
            "dataIndex": "createdBy",
            "$render": "USER",
            "$config": {
                "uri": "/api/user/:key",
                "field": "realname"
            },
            "$empty": "（系统）"
        },
        {
            "title": "创建时间",
            "dataIndex": "createdAt",
            "$render": "DATE",
            "$format": "YYYY-MM-DD"
        }
    ]
}