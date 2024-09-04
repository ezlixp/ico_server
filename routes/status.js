/**
 * Maps all status-related endpoints
 * @param {Express} app
 */
function mapStatusEndpoints(app) {
    app.head("/", (request, response) => {
        response.send();
    });
}

export default mapStatusEndpoints;
