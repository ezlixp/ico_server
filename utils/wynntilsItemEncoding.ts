import assert from "assert";
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

/**Converts a string of unicode characters to the bytes that make them up, following wynntil's item encoding standard:
 * @link {@link https://github.com/Wynntils/Wynntils/issues/2246}
 * @param byteString String of private use area unicode characters
 * @returns {number[]} Array of bytes in decimal format
 */
function stringToBytes(byteString: string): number[] {
    let byteArray: number[] = [];
    for (let i = 0; i < byteString.length; i += 2) {
        const bytes = byteString[i] + byteString[i + 1];
        if (bytes.length !== 2) {
            console.log(`malformed data character ${bytes}`);
            return [];
        }
        let codePoint = bytes.codePointAt(0);
        assert(codePoint != null);
        if (codePoint >= 0x100000) {
            if ((codePoint & 0xff) != 0xee) codePoint -= 2;
            else {
                byteArray.push(0xff);
                continue;
            }
        }
        const block1 = (0xff00 & codePoint) >> 8;
        const block2 = 0xff & codePoint;
        byteArray.push(block1, block2);
    }
    return byteArray;
}

/**Decodes a string of unicode characters following wynntil's item encoding standard:
 * @link {@link https://github.com/Wynntils/Wynntils/issues/2246}
 * @param byteString String of private use area unicode characters
 * @returns {IItem} Item data object
 */
export function decodeItem(byteString: string): IItem {
    const itemData: IItem = {
        name: "",
    };
    let byteArray: number[] = stringToBytes(byteString);
    for (let i = 0; i < byteString.length; i += 2) {
        const bytes = byteString[i] + byteString[i + 1];
        if (bytes.length !== 2) {
            console.log(`malformed data character ${bytes}`);
            return itemData;
        }
        let codePoint = bytes.codePointAt(0);
        assert(codePoint != null);
        if (codePoint >= 0x100000) {
            if ((codePoint & 0xff) != 0xee) codePoint -= 2;
            else {
                byteArray.push(0xff);
                continue;
            }
        }
        const block1 = (0xff00 & codePoint) >> 8;
        const block2 = 0xff & codePoint;
        byteArray.push(block1, block2);
    }
    const byteReader = new ByteReader(byteArray);
    while (byteReader.hasRemaining()) {
        const blockId = byteReader.read();
        if (blockId === dataTransformers.NAME && !itemData.name) {
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
        }
    }
    return itemData;
}
