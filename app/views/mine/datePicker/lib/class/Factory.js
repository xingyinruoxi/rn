/**
 * Created by liuzhenli on 2017/7/17.
 */
import { Device } from './Device';
class _Factory {
    constructor() {
        this.Device = Device.instance;
    }
}
export const NativeFactory = new _Factory();
