import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, prenom, nom, pays, ville, categorie, specialite } = body;

    if (!email || !password || !prenom || !nom || !pays) {
      return NextResponse.json({ message: "Champs obligatoires manquants" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUser.length > 0) {
      return NextResponse.json({ message: "Un compte existe déjà avec cette adresse email." }, { status: 409 });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    await db.insert(users).values({
      email,
      password_hash,
      prenom,
      nom,
      name: `${prenom} ${nom}`, // Auth.js default name field
      pays,
      ville: ville || "",
      categorie,
      specialite,
      role_plateforme: "membre",
      statut_adhesion: "gratuit"
    });

    return NextResponse.json({ message: "Utilisateur créé avec succès" }, { status: 201 });
  } catch (error: any) {
    console.error("Erreur d'inscription:", error);
    return NextResponse.json({ message: "Erreur serveur lors de l'inscription." }, { status: 500 });
  }
}
