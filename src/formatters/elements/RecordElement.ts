import {
    IElmDebugRecordValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';
import JsonML from '../../JsonML';
import EllipsisElement from './EllipsisElement';

export default class RecordElement implements IFormatterElement {
    private elmObj: IElmDebugRecordValue;
    private formatter: IJsonMLFormatter;
    private keyStyle = 'color: purple; font-weight: bold;';

    constructor(obj: IElmDebugRecordValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header() {
        const keys = Object.keys(this.elmObj.value);
        const children = keys
            .map(k => {
                return new JsonML('span')
                    .withStyle(this.keyStyle)
                    .withText(k + ': ')
                    .withChild(
                        this.formatter.handleHeader(this.elmObj.value[k])
                    );
            })
            .reduce(
                (accObj, child) => {
                    const lengthWithChild = accObj.size + child.toStr().length;
                    if (accObj.hasEllipsis) {
                        return accObj;
                    }

                    if (lengthWithChild < 50) {
                        accObj.acc.push(child);
                        accObj.size = lengthWithChild;
                    } else {
                        accObj.acc.push(new EllipsisElement().header());
                        accObj.hasEllipsis = true;
                    }

                    return accObj;
                },
                { acc: [], size: 0, hasEllipsis: false }
            )
            .acc.reduce((acc, child) => {
                acc.push(new JsonML('span').withText(', '));
                acc.push(child);
                return acc;
            }, []);

        children.splice(0, 1);

        return new JsonML('span')
            .withText('{ ')
            .withChildren(children)
            .withText(' }');
    }

    public body() {
        return new JsonML('div').withText('Not implemented yet');
    }
}