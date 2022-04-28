export function getRandomUid() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let uid = ''
  for (let i = 0; i < 8; i++) {
    const randomNum = Math.floor(Math.random() * chars.length)
    uid += chars.substring(randomNum, randomNum + 1)
  }
  return uid
}