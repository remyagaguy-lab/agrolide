/**
 * Éléments d'identité visuelle agrolide. Chaque forme a UN rôle (voir /design-system#grammaire) :
 * Emblem (couleur, noir, blanc, mono, creux) = signature ; EmblemEclate = illustration de grand format ;
 * PlanSoleil = le grand plan (+ échos) ; Encoche / EncocheBadge / EnchochePhoto = la forme de cadre (décision du 14/11/2026) :
 * fenêtre photo, chiffre d'étape, date, filigrane ; Arche = le dôme de l'emblème (pièce du logo ; ArcheBadge et ArchPhoto sont dépréciés) ;
 * Sillons = mouvement de coin ; Horizon = séparateur ; Feuille / Puce = repère ; Anneau = chargement et progression ;
 * Motif = texture.
 */
export { Arche, ARCHE, type ArcheProps, type ArcheVariant } from "./Arche"
export { ArcheBadge, type ArcheBadgeProps } from "./ArcheBadge"
export { Encoche, EncocheBadge, EnchochePhoto, type EncocheProps, type EncocheBadgeProps, type EnchochePhotoProps } from "./Encoche"
export { ENCOCHE, type EncocheFormat, type EncocheFormatId } from "./encoche-paths"
export { Anneau, type AnneauProps } from "./Anneau"
export { Emblem, type EmblemProps, type EmblemVariant } from "./Emblem"
export { EmblemEclate, type EmblemEclateProps } from "./EmblemEclate"
export { ArchPhoto, type ArchPhotoProps } from "./ArchPhoto"
export { Feuille, type FeuilleProps } from "./Feuille"
export { Puce, type PuceProps } from "./Puce"
export { Horizon, HORIZON_CREUX, HORIZON_MASQUE_TERRE, HORIZON_MASQUE_TERRE_BORD, type HorizonProps } from "./Horizon"
export { HorizonDivider, type HorizonDividerProps } from "./HorizonDivider"
export { Motif, type MotifProps } from "./Motif"
export { PlanSoleil, RAPPORTS_ECHOS, type PlanSoleilProps, type PlanSoleilTon, type PlanSoleilFond } from "./PlanSoleil"
export { Sillons, type SillonsProps, type SillonsCoin } from "./Sillons"
export { GEOMETRIE } from "./geometrie"
