export const getData = async (url: string) => {
    let response = await fetch(url, { headers: { Accept: 'application/json' } });
    let json = await response.json();
    return json;  
}