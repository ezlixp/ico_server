import ByteReader from "../types/byteReader.js";

interface IItem {
    name: string; // id 2
}

const dataTransformers = {
    START: 0,
    TYPE: 1,
    NAME: 2,
    IDENTIFICATION: 3,
    POWDER: 4,
    REROLL: 5,
    SHINY: 6,
    CUSTOM_GEAR: 7,
    DURABILITY: 8,
    REQUIREMENTS: 9,
    DAMAGE: 10,
    DEFENSE: 11,
    CUSTOM_IDENTIFICATION: 12,
    CUSTOM_CONSUMABLE_TYPE: 13,
    USES: 14,
    EFFECTS: 15,
    END: 255,
};

export function decodeItem(byteString: string): IItem {
    const itemData: IItem = {
        name: "",
    };
    let byteArray: number[] = [];
    for (let i = 0; i < byteString.length; i += 2) {
        const bytes = byteString[i] + byteString[i + 1];
        if (bytes.length !== 2) {
            console.log(`malformed data character ${bytes}`);
            return itemData;
        }
        const codePoint = bytes.codePointAt(0);
        const id = (0xff00 & codePoint!) >> 8;
        const data = 0xff & codePoint!;
        byteArray.push(id, data);
        if (id === dataTransformers.NAME) {
            console.log(data, bytes);
        }
    }
    const byteReader = new ByteReader(byteArray);
    while (byteReader.hasRemaining()) {
        const blockId = byteReader.read();
        if (blockId === dataTransformers.NAME) {
            const bytes: number[] = [];
            do {
                bytes.push(byteReader.read());
            } while (byteReader.hasRemaining() && byteReader.peek() != 0);
            if (byteReader.hasRemaining()) {
                const nullByte = byteReader.read();
                if (nullByte != 0) {
                    console.log("malformed name data");
                    continue;
                }
                let name = "";
                bytes.forEach((byte) => {
                    name += String.fromCharCode(byte);
                });
                itemData.name = name;
            }
        } else {
            if (byteReader.hasRemaining()) byteReader.read();
        }
    }
    return itemData;
}
