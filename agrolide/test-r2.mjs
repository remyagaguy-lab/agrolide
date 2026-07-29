import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

async function checkBucket(bucket, key) {
  try {
    await S3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    console.log(`Found in bucket: ${bucket}`)
  } catch (err) {
    console.log(`Not in bucket: ${bucket} (${err.name})`)
  }
}

async function run() {
  const key = 'seed/1785318871573-manuel_transformation_manioc.pdf'
  await checkBucket('agrolide-biblio', key)
  await checkBucket('agrolide-ressources', key)
}
run()
