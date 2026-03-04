import Ux from "ux";
import {_Locator} from "./allocation.__.c.locator.navigation";

// eslint-disable-next-line import/no-anonymous-default-export
export default (reference) => {
    const {
        $setting = {},
        $settingDefault = {},
    } = reference.state;
    // Title changed
    const $settings = Ux.clone($setting);
    const locator = _Locator.create(reference);
    const menuBag = locator.yoBag();
    if (menuBag) {
        $settings.title = menuBag.text;
    } else {
        $settings.title = $settingDefault.title;
    }
    return $settings;
}