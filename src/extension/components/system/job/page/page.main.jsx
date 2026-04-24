import Ux from "ux";
import {Col, Row, Table} from "antd";
import React from "react";
import renderTool from "./page.main.tool";
import renderMenu from './page.main.menu';
import {LoadingAlert} from "web";
import __ from '../Cab.module.scss';

export default (reference) => {
    const {
        $table = {}, $loading = false,
        $pagination = {}, $data = []
    } = reference.state;

    const alert = Ux.fromHoc(reference, "alert");

    const configTable = Ux.clone($table);
    Ux.configScroll(configTable, $data, reference);
    configTable.pagination = $pagination;
    return (
        <div className={__.upg_system_job}>
            {alert ? <LoadingAlert $alert={alert}/> : false}
            {renderTool(reference)}
            <Row>
                <Col span={4}>
                    {renderMenu(reference)}
                </Col>
                <Col span={20} className={"job-table"}>
                    <Table {...configTable} dataSource={$data} loading={$loading}/>
                </Col>
            </Row>
        </div>
    )
}