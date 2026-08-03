import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config({ path: '.env.local' })

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

async function run() {
  const filePath = 'public/documents/manuel_transformation_manioc.pdf'
  const key = 'seed/1785318871573-manuel_transformation_manioc.pdf'
  const body = fs.readFileSync(filePath)
  
  try {
    await S3.send(new PutObjectCommand({ 
      Bucket: 'agrolide-biblio', 
      Key: key,
      Body: body,
      ContentType: 'application/pdf'
    }))
    console.log(`Uploaded to agrolide-biblio`)
  } catch (err) {
    console.log(`Failed agrolide-biblio: ${err.message}`)
  }

  try {
    await S3.send(new PutObjectCommand({ 
      Bucket: 'agrolide-bibliotheque', 
      Key: key,
      Body: body,
      ContentType: 'application/pdf'
    }))
    console.log(`Uploaded to agrolide-bibliotheque`)
  } catch (err) {
    console.log(`Failed agrolide-bibliotheque: ${err.message}`)
  }
}
run()
