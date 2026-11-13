'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { brand, lightColors } from '@/styles/tokens'

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: lightColors['surface-container-lowest'],
    padding: 40,
    fontFamily: 'Helvetica'
  },
  border: {
    border: `4pt solid ${brand.vertFeuille}`,
    padding: 40,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 28,
    color: brand.vertProfond,
    marginBottom: 40,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    fontSize: 16,
    color: lightColors['on-surface-variant'],
    marginBottom: 20,
    textAlign: 'center'
  },
  name: {
    fontSize: 36,
    color: brand.vertProfond,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  formationTitle: {
    fontSize: 22,
    color: lightColors['on-surface'],
    marginBottom: 30,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  date: {
    fontSize: 14,
    color: brand.olive,
    marginTop: 20,
    textAlign: 'center'
  },
  numId: {
    fontSize: 10,
    color: lightColors['on-surface-muted'],
    position: 'absolute',
    bottom: 20,
    right: 20
  }
})

interface CertificatProps {
  nom: string
  prenom: string
  formationTitre: string
  dateDebut: string
  inscriptionId: string
  /** Numéro public vérifiable (page /verifier/<numero>). */
  numero?: string
  niveau?: 'participation' | 'reussite'
}

export const CertificatPDF = ({ nom, prenom, formationTitre, dateDebut, inscriptionId, numero, niveau = 'participation' }: CertificatProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.border}>
        <Text style={styles.header}>{niveau === 'reussite' ? 'CERTIFICAT DE RÉUSSITE' : 'CERTIFICAT DE PARTICIPATION'}</Text>
        
        <Text style={styles.text}>Le réseau agrolide certifie que</Text>
        
        <Text style={styles.name}>{prenom} {nom}</Text>
        
        <Text style={styles.text}>{niveau === 'reussite' ? 'a réussi l’examen final de la formation' : 'a participé avec succès à la formation'}</Text>
        
        <Text style={styles.formationTitle}>"{formationTitre}"</Text>
        
        <Text style={styles.date}>Dispensée le {new Date(dateDebut).toLocaleDateString('fr-FR')}</Text>
        
        <Text style={styles.numId}>N° {numero ?? inscriptionId}{numero ? ` · Vérification : agrolide.org/verifier/${numero}` : ''}</Text>
      </View>
    </Page>
  </Document>
)
