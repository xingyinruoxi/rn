/**
 * Created by liuzhenli on 2017/7/17.
 */
export var funHp;
(function (funHp) {
    funHp.noop = () => { };
    funHp.isFun = (fn) => {
        return (typeof fn === 'function');
    };
    funHp.isExtendsClass = (sonClass, fatherClass) => {
        try {
            return fatherClass.prototype.isPrototypeOf(sonClass.prototype);
        }
        catch (e) {
            return false;
        }
    };
})(funHp || (funHp = {}));
