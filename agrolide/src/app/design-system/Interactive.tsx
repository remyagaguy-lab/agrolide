'use client'

import * as React from 'react'
import { Download, Inbox, Plus, Search, Trash2 } from 'lucide-react'
import {
  Alert, Badge, Button, Card, CardDescription, CardTitle, EmptyState, FormField, IconButton, Input,
  Modal, ModalClose, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger,
  NativeSelect, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Spinner, Tabs, TabsContent,
  TabsList, TabsTrigger, Textarea, useToast,
} from '@/components/ui'

/** Zone interactive de la page /design-system : états, modale, onglets, toasts. */
export function Interactive() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  return (
    <div className="space-y-10">
      <div>
        <h3 className="mb-3 text-title-md">Boutons : variantes</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Rejoindre le réseau</Button>
          <Button variant="secondary">Enregistrer</Button>
          <Button variant="tonal">Voir le programme</Button>
          <Button variant="outline">Annuler</Button>
          <Button variant="text">En savoir plus</Button>
          <Button variant="danger"><Trash2 className="size-4" aria-hidden="true" />Supprimer</Button>
          <span className="rounded-card bg-surface-brand p-3">
            <Button variant="ghost-dark">Sur fond vert</Button>
          </span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-title-md">Boutons : états et tailles</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm">Taille sm (40 px)</Button>
          <Button variant="secondary">Taille md (48 px)</Button>
          <Button variant="secondary" disabled>Désactivé</Button>
          <Button variant="primary" disabled>Désactivé</Button>
          <Button
            variant="secondary"
            loading={loading}
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1800) }}
          >
            {loading ? 'Envoi…' : 'Cliquer pour charger'}
          </Button>
          <Button variant="outline"><Download className="size-4" aria-hidden="true" />Avec icône</Button>
          <IconButton label="Rechercher"><Search className="size-5" aria-hidden="true" /></IconButton>
          <IconButton label="Ajouter" variant="tonal"><Plus className="size-5" aria-hidden="true" /></IconButton>
          <Spinner className="size-6 text-primary" />
        </div>
        <p className="mt-2 text-body-sm text-on-surface-muted">Survolez et appuyez : la couche d'état (8 % / 10 %) remplace les couleurs de survol codées à la main. Naviguez au clavier (Tab) pour voir l'anneau de focus.</p>
      </div>

      <div>
        <h3 className="mb-3 text-title-md">Champs de formulaire</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Adresse e-mail" hint="Nous ne la partagerons jamais." required>
            <Input type="email" placeholder="prenom@exemple.org" autoComplete="email" />
          </FormField>
          <FormField label="Pays" required>
            <NativeSelect defaultValue="">
              <option value="" disabled>Choisir…</option>
              <option>Bénin</option>
              <option>Sénégal</option>
              <option>Côte d'Ivoire</option>
            </NativeSelect>
          </FormField>
          <FormField label="Mot de passe" error="Le mot de passe doit contenir au moins 8 caractères.">
            <Input type="password" defaultValue="abc" />
          </FormField>
          <FormField label="Champ désactivé">
            <Input disabled defaultValue="Non modifiable" />
          </FormField>
          <FormField label="Spécialité (liste personnalisée)">
            <Select>
              <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="agro">Agronomie</SelectItem>
                <SelectItem value="elevage">Élevage</SelectItem>
                <SelectItem value="transfo">Transformation</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Présentation" hint="Quelques lignes sur votre parcours.">
            <Textarea placeholder="Je suis agronome…" />
          </FormField>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-title-md">Messages</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Alert variant="info" title="Information">Votre adhésion est en cours d'examen.</Alert>
          <Alert variant="success" title="Succès">Votre profil a été enregistré.</Alert>
          <Alert variant="warning" title="Attention">Votre cotisation expire dans 7 jours.</Alert>
          <Alert variant="error" title="Erreur">Impossible d'envoyer le message. Réessayez.</Alert>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="tonal" size="sm" onClick={() => toast({ title: 'Profil enregistré', description: 'Vos modifications sont en ligne.', variant: 'success' })}>Toast succès</Button>
          <Button variant="tonal" size="sm" onClick={() => toast({ title: 'Connexion perdue', description: 'Vérifiez votre réseau.', variant: 'error' })}>Toast erreur</Button>
          <Button variant="tonal" size="sm" onClick={() => toast({ title: 'Nouvelle formation disponible', variant: 'info' })}>Toast info</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-title-md">Dialogue et onglets</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <Modal>
              <ModalTrigger asChild><Button variant="secondary">Ouvrir la boîte de dialogue</Button></ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Quitter le réseau ?</ModalTitle>
                  <ModalDescription>Votre profil et vos échanges seront supprimés. Cette action est définitive.</ModalDescription>
                </ModalHeader>
                <ModalFooter>
                  <ModalClose asChild><Button variant="outline">Annuler</Button></ModalClose>
                  <ModalClose asChild><Button variant="danger">Quitter définitivement</Button></ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <p className="mt-3 text-body-sm text-on-surface-muted">Échap ferme ; le focus est piégé puis rendu au bouton.</p>
          </Card>
          <Tabs defaultValue="apropos">
            <TabsList>
              <TabsTrigger value="apropos">À propos</TabsTrigger>
              <TabsTrigger value="membres">Membres</TabsTrigger>
              <TabsTrigger value="docs">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="apropos" className="text-body-md text-on-surface-variant">Flèches gauche/droite pour naviguer entre onglets.</TabsContent>
            <TabsContent value="membres" className="text-body-md text-on-surface-variant">Liste des membres.</TabsContent>
            <TabsContent value="docs" className="text-body-md text-on-surface-variant">Ressources partagées.</TabsContent>
          </Tabs>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-title-md">Cartes, badges, état vide</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardTitle>Carte contour</CardTitle><CardDescription className="mt-1">Fond clair, bordure fine : usage par défaut.</CardDescription></Card>
          <Card variant="filled"><CardTitle>Carte teintée</CardTitle><CardDescription className="mt-1">Sans bordure, pour regrouper.</CardDescription></Card>
          <Card variant="elevated" interactive><CardTitle>Carte élevée</CardTitle><CardDescription className="mt-1">Cliquable : survol visible.</CardDescription></Card>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="junior">Junior</Badge><Badge variant="professionnel">Professionnel</Badge>
          <Badge variant="partenaire">Partenaire</Badge><Badge variant="senior">Sénior</Badge>
          <Badge variant="actif">Actif</Badge><Badge variant="expire">Expire bientôt</Badge><Badge variant="nouveau">Nouveau</Badge>
          <Badge variant="success">Succès</Badge><Badge variant="warning">Alerte</Badge><Badge variant="error">Erreur</Badge><Badge variant="info">Info</Badge><Badge>Neutre</Badge>
        </div>
        <EmptyState
          className="mt-6"
          icon={<Inbox />}
          title="Aucune opportunité pour l'instant"
          description="Les offres publiées par les membres apparaîtront ici. Soyez le premier à en partager une."
          action={<Button variant="secondary"><Plus className="size-4" aria-hidden="true" />Publier une offre</Button>}
        />
      </div>
    </div>
  )
}
