/**
 * Generate a random id based on the time
 * @return {string} random id
 */
export const randomID = () =>
    (new Date()).getTime() + "";