import fs from 'fs-extra';

/**
 * Checks if a directory exists at the given path.
 *
 * @param {string} dirPath - The path of the directory to check.
 * @returns {boolean} True if the directory exists, false otherwise.
 */
export const isDirectoryExists = (dirPath) => {
    return fs.pathExistsSync(dirPath);
};

/**
 * Check if a file exists at the given path.
 * @param filePath
 * @returns {*}
 */
export const isFileExists = (filePath) => {
    return fs.pathExistsSync(filePath);
};

/**
 * Copies file(s) or directories from a given source(s) to a specified destination.
 *
 * @param {string | string[]} sources - The path(s) to the file(s) or directory(ies) to be copied. This can be either a single string representing a path or an array of strings representing multiple paths.
 * @param {string} destination - The path to the destination where the files or directories should be copied.
 * @param {object} options - Copying file options
 */
export const copyFiles = (sources, destination, options = {}) => {
    if (sources) {
        // Check if sources is defined
        if (Array.isArray(sources)) {
            // If it's an array, copy each item
            for (const source of sources) {
                fs.copySync(source, destination, options);
            }
        } else {
            // If it's a single string, copy it directly
            fs.copySync(sources, destination, options);
        }
    }
};

/**
 * Creates a directory at the specified path, recursively creating parent directories if needed.
 *
 * @param {string} dirPath - The path of the directory to create.
 * @param {Object} [options={}] - Optional options for directory creation (see `fs.mkdirpSync` documentation).
 */
export const createDirectory = (dirPath, options = {}) => {
    fs.mkdirpSync(dirPath, options);
};

/**
 * Writes content to a file at the specified path, creating the file if it doesn't exist.
 *
 * @param {string} filePath - The path of the file to write to.
 * @param {string} content - The content to be written to the file.
 */
export const writeContentToFile = (filePath, content) => {
    if (!isFileExists(filePath)) {
        return;
    }
    fs.writeFileSync(filePath, content);
};

/**
 * Reads the content of a file at the specified path and returns it as a string.
 *
 * @param {string} filePath - The path of the file to read.
 * @returns {string} The content of the file as a string.
 */
export const readFileContent = (filePath) => {
    if (!isFileExists(filePath)) {
        return '';
    }
    return fs.readFileSync(filePath)?.toString();
};

/**
 * Deletes a directory at the specified path, including all its contents.
 *
 * @param {string} dirPath - The path of the directory to delete.
 */
export const deleteDirectory = (dirPath) => {
    if (!isDirectoryExists(dirPath)) {
        return;
    }
    fs.removeSync(dirPath);
};

/**
 * Deletes a file at the specified path
 *
 * @param {string} filePath - The path of the file to delete.
 */
export const deleteFile = (filePath) => {
    if (!isFileExists(filePath)) {
        return;
    }
    fs.removeSync(filePath);
};
