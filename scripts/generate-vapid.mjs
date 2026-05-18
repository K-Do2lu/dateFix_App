import webpush from 'web-push'

const keys = webpush.generateVAPIDKeys()
console.log('아래 내용을 .env 와 Render Environment 에 넣으세요:\n')
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`)
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`)
console.log('VAPID_SUBJECT=mailto:you@example.com')
