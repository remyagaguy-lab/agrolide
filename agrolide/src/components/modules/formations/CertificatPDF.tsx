'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica'
  },
  border: {
    border: '4pt solid #50a853',
    padding: 40,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 28,
    color: '#1b5e38',
    marginBottom: 40,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 20,
    textAlign: 'center'
  },
  name: {
    fontSize: 36,
    color: '#1b5e38',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  formationTitle: {
    fontSize: 22,
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  date: {
    fontSize: 14,
    color: '#878e2c',
    marginTop: 20,
    textAlign: 'center'
  },
  numId: {
    fontSize: 10,
    color: '#aaaaaa',
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
}

export const CertificatPDF = ({ nom, prenom, formationTitre, dateDebut, inscriptionId }: CertificatProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.border}>
        <Text style={styles.header}>CERTIFICAT DE PARTICIPATION</Text>
        
        <Text style={styles.text}>Le réseau agrolide certifie que</Text>
        
        <Text style={styles.name}>{prenom} {nom}</Text>
        
        <Text style={styles.text}>a participé avec succès à la formation</Text>
        
        <Text style={styles.formationTitle}>"{formationTitre}"</Text>
        
        <Text style={styles.date}>Dispensée le {new Date(dateDebut).toLocaleDateString('fr-FR')}</Text>
        
        <Text style={styles.numId}>N° {inscriptionId}</Text>
      </View>
    </Page>
  </Document>
)
