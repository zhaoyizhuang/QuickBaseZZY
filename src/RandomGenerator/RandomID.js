/**
 * Generate a random id based on the time
 * stable, predictable, and unique keys help React works faster.
 * @return {string} random id
 */
export const randomID = () =>
    (new Date()).getTime() + "";