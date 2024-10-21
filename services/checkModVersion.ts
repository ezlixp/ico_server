const minimumModVersion = [1, 1, 0, 12]; // [0].[1].[2]-beta.[3]
const versionExtractorPattern = new RegExp(
    "guildapi/(?<major>\\d+).(?<minor>\\d+).(?<revision>\\d+)(-beta.(?<beta>\\d+))?"
);

function isMinimumVersionSatisfied(versionString: string | undefined): boolean {
    if (!versionString) return false;
    const matcher = versionExtractorPattern.exec(versionString);
    if (!matcher) {
        console.log("malformed mod version received", versionString);
        return false;
    }
    const version = [
        parseInt(matcher.groups!.major),
        parseInt(matcher.groups!.minor),
        parseInt(matcher.groups!.revision),
        matcher.groups!.beta ? parseInt(matcher.groups!.beta) : 999999999,
    ];
    for (let i = 0; i < 4; ++i) {
        if (version[i] != minimumModVersion[i]) return version[i] > minimumModVersion[i];
    }
    return true;
}

export default isMinimumVersionSatisfied;
