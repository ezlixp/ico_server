interface IModVersionResponse {
    versionNumber: string;
    download: string;
}

async function getLatestVersion(): Promise<IModVersionResponse | null> {
    let json: JSON = JSON.parse("{}");
    const url = "https://api.modrinth.com/v2/project/guild-api/version";
    try {
        const response = await fetch(url);
        const res = await response.json();
        console.log(res[0].version_number, res[0].files[0].url);
        return { versionNumber: res[0].version_number, download: res[0].files[0].url };
    } catch (error) {
        console.log("get version error:", error);
    }
    return null;
}

export default getLatestVersion;
