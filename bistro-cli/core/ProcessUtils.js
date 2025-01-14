import shelljs from 'shelljs';

/**
 * Execute a command in the shell
 * @param command
 * @returns {*}
 */
export const executeCommand = (command) => shelljs.exec(command);
