import Ux from "ux";
import React from "react";

export default (reference, jsx) => {
    const amount = Ux.formHit(reference, "amount");
    return (
        <span style={{
            fontSize: 16,
            color: "red"
        }}>
            ￥{Ux.formatCurrency(amount)}
        </span>
    )
}