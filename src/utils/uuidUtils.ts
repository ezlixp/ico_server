export function insertDashes(str: string) {
    str = str.replace("-", "");
    if (str.length != 32) return "";
    return (
        str.substring(0, 8) +
        "-" +
        str.substring(8, 12) +
        "-" +
        str.substring(12, 16) +
        "-" +
        str.substring(16, 20) +
        "-" +
        str.substring(20)
    );
}
