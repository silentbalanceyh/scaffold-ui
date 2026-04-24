import Ux from "ux";
import React from "react";

export default (reference, jsx) => {
    const amount = Ux.formHit(reference, "amount");
    const formValue = {};
    formValue.amountActual = amount;
    Object.assign(formValue, formValue);
    Ux.formHits(reference, formValue);
    return (
        <span style={{
            fontSize: 16,
            color: "red"
        }}>
            ￥{Ux.formatCurrency(amount)}
        </span>
    )
}