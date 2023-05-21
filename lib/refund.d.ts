import YooKassa from './yookassa';
export default class Refund {
    _instance: YooKassa;
    id: string;
    constructor(instance: any, data: any);
    reload(): Promise<boolean>;
}
