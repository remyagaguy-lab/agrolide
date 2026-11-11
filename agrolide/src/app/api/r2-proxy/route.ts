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

// Buckets publics uniquement (les buckets privés ne sont jamais signés ici)
const PUBLIC_BUCKETS = new Set([
  process.env.NEXT_PUBLIC_R2_PUBLIC_BUCKET || 'agrolide-ressources',
])

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const urlParam = searchParams.get('url')
    
    if (!urlParam) {
      return new NextResponse('Missing url parameter', { status: 400 })
    }

    // Uniquement des URL R2 (jamais de redirection vers un site externe)
    let urlObj: URL
    try {
      urlObj = new URL(urlParam)
    } catch {
      return new NextResponse('Invalid url', { status: 400 })
    }
    if (urlObj.protocol !== 'https:' || !urlObj.hostname.endsWith('.r2.cloudflarestorage.com')) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Le nom du bucket est le sous-domaine : seul le bucket public est autorisé
    const bucketName = urlObj.hostname.split('.')[0]
    if (!PUBLIC_BUCKETS.has(bucketName)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
    const objectKey = decodeURIComponent(urlObj.pathname.substring(1))
    if (!objectKey || objectKey.includes('..')) {
      return new NextResponse('Invalid key', { status: 400 })
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ResponseContentDisposition: 'inline'
    })
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    
    // Ajout d'un cache agressif (Next.js & Navigateur) pour éviter de re-signer l'URL à chaque fois
    return NextResponse.redirect(signedUrl, {
      status: 302,
      headers: {
        'Cache-Control': 'public, max-age=3000, s-maxage=3000, stale-while-revalidate=300',
      }
    })
  } catch (error) {
    console.error('R2 Proxy Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
