const signatureLetters = 'DFIKMNOPSTU';
const signature = 'STUMPFDOMINIK';
const signatureOverlay = 'AH3YCDB6YEFEG';
const message = (await Bun.file('secret-message').text()).trim().toUpperCase();
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface EncryptedCharacter {
  value: string;
  color: 'green' | 'red';
}
const _green = '\x1b[32m';
const _red = '\x1b[31m';
type EncryptedAlphabetMap = Record<string, EncryptedCharacter>;

function main() {
  const encryptedAlphabetMap: EncryptedAlphabetMap = {};

  let missingCharCounter = 0;
  for (let i = 0; i < alphabet.length; i += 1) {
    const char = alphabet[i];

    if (signatureLetters.includes(char)) {
      encryptedAlphabetMap[char] = {
        color: 'green',
        value: signatureOverlay[signature.indexOf(char)],
      };
    } else {
      encryptedAlphabetMap[char] = {
        color: 'red',
        value:
          missingCharCounter < signatureLetters.length
            ? signatureOverlay[
                signature.indexOf(signatureLetters[missingCharCounter])
              ]
            : '_',
      };
      missingCharCounter += 1;
    }
  }

  // console.log(encryptedAlphabetMap);

  const encryptedMessage = message
    .split('')
    .map((char) =>
      char in encryptedAlphabetMap ? encryptedAlphabetMap[char] : char,
    );
  // console.log(encryptedMessage)
  Bun.write('encrypted.json', JSON.stringify(encryptedMessage));
}

main();
