/**
 * Created by liuzhenli on 2017/7/17.
 */
export var componentHp;
(function (componentHp) {
    componentHp.createTopProps = (props) => {
        return Object.assign({
            key: undefined,
            ref: undefined
        }, props);
    };
})(componentHp || (componentHp = {}));
