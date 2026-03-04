import React from 'react';
import Ux from 'ux';
import {_Locator} from "./allocation.__.c.locator.navigation";

const __rxNavApp = (reference) => (event) => {
    Ux.prevent(event);
    /*
     * When you click `logo` / `main` uri to navigate to correct
     * routing URI
     */
    const {$bag} = reference.state;
    const locator = _Locator.create(reference);
    if ($bag) {
        locator.goApp($bag);
        // Ux.toRoute(reference, $bag.uri);
    } else {
        locator.goHome();
        // Ux.toRoute(reference, Ux.Env.ENTRY_ADMIN);
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default async (reference) => {
    return (logo, title, _) => {
        const locator = _Locator.create(reference);
        const menuBag = locator.yoBag();
        // Title formatted
        let logoJsx;
        if (menuBag && menuBag.icon && menuBag.hasOwnProperty("bag")) {
            logoJsx = (<img src={menuBag.icon} alt={menuBag.text}/>);
        } else {
            logoJsx = logo;
        }
        const {layout} = _;
        return (
            // eslint-disable-next-line
            <a href={""} className={`ux-logo-${layout}-a`} onClick={__rxNavApp(reference)}>
                {logoJsx}{title}
            </a>
        )
    }
}