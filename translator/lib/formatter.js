/**
 * 
 * @param {string} source 
 */
const separateEmail = (source) => {
  const splited = source.split('\n')
  const [email, original] = [splited[0], splited.slice(1, splited.length)]
  return {
    email,
    original: original.join('\n')
  }
};

module.exports = {
  separateEmail,
}