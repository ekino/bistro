import fs from 'fs-extra';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    copyFiles,
    createDirectory,
    deleteDirectory,
    isDirectoryExists,
    isFileExists,
    readFileContent,
    writeContentToFile,
} from './FileUtils.js';

// Update the path as needed

vi.mock('fs-extra');

describe('File Operations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('copyFiles', () => {
        it('should copy single source to destination', () => {
            copyFiles('source.txt', 'destination.txt');
            expect(fs.copySync).toHaveBeenCalledWith('source.txt', 'destination.txt', {});
        });

        it('should copy multiple sources to destination', () => {
            copyFiles(['source1.txt', 'source2.txt'], 'destination');
            expect(fs.copySync).toHaveBeenCalledWith('source1.txt', 'destination', {});
            expect(fs.copySync).toHaveBeenCalledWith('source2.txt', 'destination', {});
        });

        it('should not copy if sources is not defined', () => {
            copyFiles(undefined, 'destination');
            expect(fs.copySync).not.toHaveBeenCalled();
        });
    });

    describe('createDirectory', () => {
        it('should create a directory with given path', () => {
            createDirectory('dirPath');
            expect(fs.mkdirpSync).toHaveBeenCalledWith('dirPath', {});
        });

        it('should create a directory with given options', () => {
            const options = { mode: 0o755 };
            createDirectory('dirPath', options);
            expect(fs.mkdirpSync).toHaveBeenCalledWith('dirPath', options);
        });
    });

    describe('writeContentToFile', () => {
        it('should write content to a file', () => {
            writeContentToFile('filePath.txt', 'Hello, world!');
            expect(fs.writeFileSync).toHaveBeenCalledWith('filePath.txt', 'Hello, world!');
        });
    });

    describe('readFileContent', () => {
        it('should read content from a file', () => {
            // eslint-disable-next-line no-undef
            fs.readFileSync.mockReturnValue(Buffer.from('File content'));
            const content = readFileContent('filePath.txt');
            expect(content).toBe('File content');
            expect(fs.readFileSync).toHaveBeenCalledWith('filePath.txt');
        });
    });

    describe('deleteDirectory', () => {
        it('should delete a directory with given path', () => {
            deleteDirectory('dirPath');
            expect(fs.removeSync).toHaveBeenCalledWith('dirPath');
        });
    });

    describe('isDirectoryExists', () => {
        it('should return true if directory exists', () => {
            fs.pathExistsSync.mockReturnValue(true);
            const exists = isDirectoryExists('dirPath');
            expect(exists).toBe(true);
            expect(fs.pathExistsSync).toHaveBeenCalledWith('dirPath');
        });

        it('should return false if directory does not exist', () => {
            fs.pathExistsSync.mockReturnValue(false);
            const exists = isDirectoryExists('dirPath');
            expect(exists).toBe(false);
            expect(fs.pathExistsSync).toHaveBeenCalledWith('dirPath');
        });
    });

    describe('isFileExists', () => {
        it('should return true if file exists', () => {
            fs.pathExistsSync.mockReturnValue(true);
            const exists = isFileExists('filePath.txt');
            expect(exists).toBe(true);
            expect(fs.pathExistsSync).toHaveBeenCalledWith('filePath.txt');
        });

        it('should return false if file does not exist', () => {
            fs.pathExistsSync.mockReturnValue(false);
            const exists = isFileExists('filePath.txt');
            expect(exists).toBe(false);
            expect(fs.pathExistsSync).toHaveBeenCalledWith('filePath.txt');
        });
    });
});
