import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const urlParam = searchParams.get('url')
    
    if (!urlParam) {
      return new NextResponse('Missing url parameter', { status: 400 })
    }

    if (!urlParam.includes('r2.cloudflarestorage.com')) {
      return NextResponse.redirect(urlParam)
    }

    const urlObj = new URL(urlParam)
    const objectKey = decodeURIComponent(urlObj.pathname.substring(1))
    
    // Le nom du bucket est le sous-domaine
    const bucketName = urlObj.hostname.split('.')[0]

    const command = new GetObjectCommand({
      Bucket: bucketName || process.env.R2_BUCKET_NAME,
      Key: objectKey,
      ResponseContentDisposition: 'inline'
    })
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    return NextResponse.redirect(signedUrl)
  } catch (error) {
    console.error('R2 Proxy Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
