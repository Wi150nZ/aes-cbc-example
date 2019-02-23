const crypto = require('crypto')

const config = {
  algorithm: 'aes-128-cbc',
  private_key: 'VB47upl4ZEqGkb5a'
}

const key = crypto.scryptSync(config.private_key, 'salt', 32)

function encrypt(data) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(config.algorithm, config.private_key, iv)

  let encrypted_data = cipher.update(data, 'utf8', 'base64')
  encrypted_data += cipher.final('base64')
  encrypted_data += `:${iv.toString('base64')}`

  return encrypted_data
}


function decrypt(encrypted_data) {
  // parse the data
  parsed_data = encrypted_data.split(':')
  if (parsed_data.length != 2) {
    throw new Error('invalid encrypted data sent')
  }

  // convert iv into a byte string
  parsed_data[1] = Buffer.from(parsed_data[1], 'base64')

  const decipher = crypto.createDecipheriv(config.algorithm, config.private_key, parsed_data[1])
  let decrypted_data = decipher.update(parsed_data[0], 'base64', 'utf8')
  decrypted_data += decipher.final('utf8')

  return decrypted_data
}

const text = 'HeLLo WoRlD'
const encrypted_text = encrypt(text)
console.log(`encrypted: ${encrypted_text}`)

const decrypted_text = decrypt(encrypted_text)
console.log(`decrypted: ${decrypted_text}`)