export class DataLoader {
    static regsDataMap = new Map();

    static async init() {
        const jsonFiles = [
            'one-addr',
        ];

        const loadPromises = jsonFiles.map(async (fileName) => {
            try {
                const response = await fetch(`/json/architecture/registers/${fileName}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load ${fileName}.json`);
                }
                const data = await response.json();
                this.regsDataMap.set(fileName, data);
            } catch (error) {
                console.error(`Error loading ${fileName}.json:`, error);
            }
        });

        await Promise.all(loadPromises);
    }

    static get(fileName) {
        return this.regsDataMap.get(fileName);
    }
}