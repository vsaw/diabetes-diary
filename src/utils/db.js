const DB_NAME = 'DiabetesDiaryDB'
const DB_VERSION = 1
const STORE_NAME = 'entries'

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error)
            reject(event.target.error)
        }

        request.onsuccess = (event) => {
            resolve(event.target.result)
        }

        request.onupgradeneeded = (event) => {
            const db = event.target.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'date' })
            }
        }
    })
}

export const getEntry = async (dateStr) => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.get(dateStr)

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export const saveEntry = async (entry) => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.put(entry)

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export const getAllEntries = async () => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

/**
 * Get entries for a specific month
 * @param {number} year 
 * @param {number} month (0-11)
 */
export const getEntriesByMonth = async (year, month) => {
    const all = await getAllEntries()
    // Filter locally for now as date strings are not easily rangeable in indexeddb 
    // without changing the key format to ISO/YYYY-MM-DD.
    // This is still efficient for "a few entries" as requested.
    return all.filter(entry => {
        const d = new Date(entry.date)
        return d.getFullYear() === year && d.getMonth() === month
    })
}
