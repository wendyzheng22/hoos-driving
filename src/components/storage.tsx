import { Preferences } from '@capacitor/preferences';

export const set = async (storeKey: string, storeValue: string) => {
    await Preferences.set({
        key: storeKey,
        value: storeValue,
    });
};

export const get = async (getKey: string) => {
    const value = await Preferences.get({ key: getKey });
    return value;
};

export const clearAll = async () => {
    get('user').then(user =>{
        Preferences.clear();
        let value = user.value;
        if(value)
            set('user', value);
    })
}