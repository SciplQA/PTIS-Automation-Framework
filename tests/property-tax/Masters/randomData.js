const generatedValues = new Set();

export function generateUniqueUppercase(length = 3) {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let value = '';

    do {
        value = '';

        for (let i = 0; i < length; i++) {

            const randomIndex =
                Math.floor(Math.random() * characters.length);

            value += characters[randomIndex];
        }

    } while (generatedValues.has(value));

    generatedValues.add(value);

    return value;
}

export function generateUniqueNumber(length = 6) {
    if (!Number.isInteger(length) || length < 1) {
        throw new Error('length must be a positive integer');
    }

    const minimum = length === 1 ? 0 : 10 ** (length - 1);
    const range = 9 * 10 ** (length - 1);
    let value = '';

    do {
        value = String(Math.floor(minimum + Math.random() * range));
    } while (generatedValues.has(value));

    generatedValues.add(value);

    return value;
}

