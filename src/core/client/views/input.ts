import * as alt from 'alt-client';
import { InputMenu, InputResult } from '../../shared/interfaces/inputMenus';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { View_Events_Input_Menu } from '../../shared/enums/views';
import { WebViewController } from '../extensions/view2';
import { sleep } from '../utility/sleep';

const PAGE_NAME = 'InputBox';
let inputMenu: InputMenu;

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    static async show(_inputMenu: InputMenu): Promise<void> {
        inputMenu = _inputMenu;

        if (isAnyMenuOpen()) {
            return;
        }

        // Need to add a sleep here because wheel menu inputs can be be too quick.
        await sleep(150);

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Submit`, InternalFunctions.submit);
        view.on(`${PAGE_NAME}:Close`, InternalFunctions.close);

        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close(isNotCancel = false) {
        alt.toggleGameControls(true);

        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.off(`${PAGE_NAME}:Submit`, InternalFunctions.submit);
        view.off(`${PAGE_NAME}:Close`, InternalFunctions.close);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;

        if (isNotCancel) {
            return;
        }

        if (inputMenu.callback) {
            inputMenu.callback(null);
        }

        if (inputMenu.serverEvent) {
            alt.emitServer(inputMenu.serverEvent, null);
        }
    }

    static submit(results: InputResult[]) {
        if (inputMenu.callback) {
            inputMenu.callback(results);
        }

        if (inputMenu.serverEvent) {
            alt.emitServer(inputMenu.serverEvent, results);
        }

        InternalFunctions.close(true);
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetMenu`, inputMenu.title, inputMenu.options, inputMenu.generalOptions);
    }
}

export class InputView {
    /**
     * Show an input menu from client-side.
     * @static
     * @param {InputMenu} _inputMenu
     * @memberof InputView
     */
    static setMenu(_inputMenu: InputMenu) {
        InternalFunctions.show(_inputMenu);
    }
}

alt.onServer(View_Events_Input_Menu.SetMenu, InternalFunctions.show);
