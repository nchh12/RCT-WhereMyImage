export const isLetters = letter => {
    return letter.match(/^[^a-zA-Z ]+$/) ? true : false;
};
