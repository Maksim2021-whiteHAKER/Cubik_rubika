// Scripts/control-get-mode.js

export function getControlMode() {
    return document.getElementById('control-selecter')?.value || 'control_arrows';
}