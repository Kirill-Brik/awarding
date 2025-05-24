import IMask from 'imask';

export default function usePhoneMask() {
    const phoneMask = IMask.createMask({
        mask: '+{7} {9}00 000 00 00',

    });
    return {
        formatter: (value: string) => {
            if (['+', '8', '7'].includes(value.slice(0, 1)))
                value = '7' + value.slice(1);
            phoneMask.resolve(value);
            return phoneMask.value;
        },
        parser: (value: string) => {
            value = value.replace(/\D/g, '')
            if (['8', '7'].includes(value.slice(0, 1)))
                value = '7' + value.slice(1);
            phoneMask.resolve(value);
            let newVal = phoneMask.unmaskedValue
            if (['8', '7'].includes(newVal.slice(0, 1)))
                newVal = '8' + newVal.slice(1);
            return newVal;
        }
    }
}
