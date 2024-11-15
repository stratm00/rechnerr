export function retrieveStateFromLocalStorage<T>(key: string): T|null{
    const ans = localStorage.getItem(key)
     
    return ans!==null ? JSON.parse(ans) as T: null;
}