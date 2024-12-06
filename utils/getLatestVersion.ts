interface IModVersionResponse {
    versionNumber: string;
    download: string;
}

async function getLatestVersion(): Promise<IModVersionResponse | null> {
    const url = "https://api.modrinth.com/v2/project/guild-api/version";
    try {
        const response = await fetch(url);
        const res = await response.json();
        return { versionNumber: res[0].version_number, download: res[0].files[0].url };
    } catch (error) {
        console.log("get version error:", error);
    }
    return null;
}

export default getLatestVersion;
