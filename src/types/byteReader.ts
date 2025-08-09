export default class ByteReader {
    array: number[];
    index: number;
    constructor(array: number[]) {
        this.array = array;
        this.index = 0;
    }

    read() {
        if (this.index >= this.array.length) throw "array index out of bounds";
        return this.array[this.index++];
    }

    peek() {
        if (this.index >= this.array.length) throw "array index out of bounds";
        return this.array[this.index];
    }

    hasRemaining = () => this.index < this.array.length;
}
