const getApiRoot = () => {
    if (localStorage.getItem("currentNode") !== null && localStorage.getItem("currentNode") !== "0") {
        return "/api/nodes/" + localStorage.getItem("currentNode");
    } else return "/api";
}

// Get the default headers of the request
const getHeaders = () => {
    let headers = localStorage.getItem("password") ? {password: localStorage.getItem("password")} : {};
    headers['content-type'] = 'application/json';

    return headers;
}

// Run a plain request with all default values using the base path
export const baseRequest = async (path, method = "GET", body = {}, headers = {}) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    return await fetch("/api" + path, {
        headers: {...getHeaders(), ...headers}, method,
        body: method !== "GET" ? JSON.stringify(body) : undefined,
        signal: controller.signal
    });
}

// Run a plain request with all default values
export const request = async (path, method = "GET", body = {}, headers = {}) => {
    return await fetch(getApiRoot() + path, {
        headers: {...getHeaders(), ...headers}, method,
        body: method !== "GET" ? JSON.stringify(body) : undefined
    });
}

// Run a GET request and get the json of the response
export const jsonRequest = async (path, headers = {}) => {
    return (await request(path, "GET", null, headers)).json();
}

// Run a POST request and post some values
export const postRequest = async (path, body = {}, headers = {}) => {
    return await request(path, "POST", body, headers);
}

// Run a PATCH request update a resource
export const patchRequest = async (path, body = {}, headers = {}) => {
    return await request(path, "PATCH", body, headers);
}

// Run a DELETE request and delete a resource
export const deleteRequest = async (path, body = {}, headers = {}) => {
    return await request(path, "DELETE", body, headers);
}

// Download a specific file from the response output
export const downloadRequest = async (path, body = {}, headers = {}) => {
    const file = await request(path, "GET", body, headers);
    let element = document.createElement('a');
    let url = file.headers.get('Content-Disposition').split('filename=')[1];
    element.setAttribute("download", url.replaceAll("\"", ""));

    const blob = await file.blob();
    element.href = window.URL.createObjectURL(blob);
    document.body.appendChild(element);
    element.click();
    element.remove();
}