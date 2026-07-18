import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Simple in-memory rate limiter fallback if Upstash is not configured
const ipRequests = new Map<string, { count: number, resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // If Upstash will be used, we handle it asynchronously below
    return true; 
  }
  const now = Date.now();
  const record = ipRequests.get(ip);
  if (!record || now > record.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (record.count >= 5) return false; // Max 5 uploads per minute
  record.count++;
  return true;
}

// Configuration optionnelle d'Upstash
const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requêtes par minute
      analytics: true,
    })
  : null;

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting (Protection Anti-DDoS)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    
    if (ratelimit) {
      const { success } = await ratelimit.limit(`upload_limit_${ip}`)
      if (!success) {
        return NextResponse.json({ error: 'Trop de requêtes, veuillez patienter.' }, { status: 429 })
      }
    } else {
      if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: 'Trop de requêtes, veuillez patienter.' }, { status: 429 })
      }
    }

    // Vérification de l'admin
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { filename, contentType, folder } = await request.json()

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const ext = filename.split('.').pop()
    const objectKey = `${folder || 'uploads'}/${crypto.randomUUID()}.${ext}`

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_R2_PUBLIC_BUCKET || process.env.R2_BUCKET_NAME,
      Key: objectKey,
      ContentType: contentType,
    })

    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 })
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${objectKey}`

    return NextResponse.json({ presignedUrl, objectKey, publicUrl })
  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
