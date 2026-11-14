# -*- coding: utf-8 -*-
"""
Cas chiffrés de la formation (point 9) : calcul complet par script, même méthode que le cas Diap Touré
(leçon 5.7) : seuil de rentabilité, DSCR en 3 scénarios, flux du projet, VAN, TRI, délai de récupération.
Les chiffres sont des hypothèses PÉDAGOGIQUES reconstituées, à remplacer par vos devis et vos relevés de prix.
Usage : python scripts/modeles_bp/cas_chiffres.py [--json sortie.json]
"""
import json
import sys

M = 1_000_000


def irr(flows):
    lo, hi = -0.9, 5.0
    f = lambda r: sum(c / (1 + r) ** t for t, c in enumerate(flows))
    if f(lo) * f(hi) > 0:
        return None
    for _ in range(200):
        mid = (lo + hi) / 2
        if f(lo) * f(mid) <= 0:
            hi = mid
        else:
            lo = mid
    return (lo + hi) / 2


def pmt(rate, n, pv):
    return pv * rate / (1 - (1 + rate) ** -n)


def evalue(c, scen):
    """Évalue un cas pour un scénario ; renvoie un dict de résultats en M de monnaie."""
    ca_cro, cv = c["ca"](scen), c["cv"](scen)
    pers, fixes = c["personnel"], c["fixes"]
    amort = sum(m / d for _, m, d in c["immos"])
    immos = sum(m for _, m, d in c["immos"])
    bfr = c["bfr"]
    cout = immos + bfr
    apport = round(cout * c["pct_apport"], 1)
    emprunt = cout - apport
    taux, duree, diff = c["taux"], c["duree"], c["differe"]
    ann = pmt(taux, duree - diff, emprunt)
    # dette
    cap, dette = emprunt, []
    for y in range(1, 8):
        inte = cap * taux
        remb = 0 if y <= diff or y > duree else ann - inte
        dette.append(dict(an=y, interets=inte, capital=remb, service=inte + remb, fin=cap - remb))
        cap -= remb
    mont = c["montee"]
    res = []
    for y in range(1, 6):
        ca = ca_cro * (mont if y == 1 else 1)
        cvy = cv  # coûts de production engagés en totalité dès l'année 1 (comme le cas Diap)
        if c.get("cv_suit_ca"):
            cvy = cv * (mont if y == 1 else 1)
        ebe = ca - cvy - fixes - pers
        rex = ebe - amort
        rai = rex - dette[y - 1]["interets"]
        is_ = max(0, rai * c["is"])
        rn = rai - is_
        is_expl = max(0, rex * c["is"])
        res.append(dict(an=y, ca=ca, cv=cvy, ebe=ebe, rex=rex, rai=rai, is_=is_, rn=rn, flux=ebe - is_expl))
    vnc5 = immos - 5 * amort
    flux = [-cout] + [round(r["flux"], 1) for r in res]
    flux[5] += round(vnc5 + bfr, 1)
    van = sum(f / (1 + c["act"]) ** t for t, f in enumerate(flux))
    tri = irr(flux)
    cum, payback = -cout, None
    for y, r in enumerate(res, 1):
        nxt = cum + r["flux"]
        if nxt >= 0 and payback is None:
            payback = (y - 1) + (-cum) / r["flux"]
        cum = nxt
    a2 = res[1]
    flux_dispo = a2["ebe"] - a2["is_"]
    service2 = dette[1]["service"]
    # seuil (année 2) : coûts fixes totaux = personnel + fixes + amortissements + intérêts
    cf_tot = pers + fixes + amort + dette[1]["interets"]
    tm = (ca_cro - cv) / ca_cro
    seuil = round(cf_tot, 1) / round(tm, 3) if tm > 0 else None
    return dict(ca=ca_cro, cv=cv, immos=immos, bfr=bfr, cout=cout, apport=apport, emprunt=emprunt, annuite=ann, amort=amort,
                res=res, dette=dette, flux=flux, van=van, tri=tri, payback=payback,
                dscr=flux_dispo / service2, flux_dispo=flux_dispo, service2=service2, seuil=seuil, tm=tm, cf_tot=cf_tot,
                vnc5=vnc5, immos_list=c["immos"], personnel=pers, fixes=fixes, montee=c["montee"], taux=c["taux"], duree=c["duree"], differe=c["differe"], pct_is=c["is"], act=c["act"])


# ----------------------------------------------------------------------------------------------------------------
# CAS 1 — Poulet de chair, Togo (périurbain de Lomé) — FCFA
# ----------------------------------------------------------------------------------------------------------------
def poulet():
    bat, places, bandes = 3, 2000, 6            # 3 bâtiments de 2 000 sujets, 6 bandes/an (42 j + vide sanitaire)
    mis_en_place = bat * places * bandes         # 36 000 poussins
    pu = dict(poussin=0.000550, aliment_kg=0.000380, ic=1.75, poids=2.0, vet=0.000090, litiere=0.000100, autres=0.000100)
    prix_poulet = 0.003000                       # M FCFA par poulet vendu (3 000 FCFA)

    def ca(s):
        mort = 0.06 + s.get("mort", 0.0)
        vendus = mis_en_place * (1 - mort)
        return vendus * prix_poulet * s.get("prix", 1.0)

    def cv(s):
        alim = pu["aliment_kg"] * s.get("aliment", 1.0)
        par_sujet = pu["poussin"] + alim * pu["ic"] * pu["poids"] + pu["vet"] + pu["litiere"] + pu["autres"]
        return mis_en_place * par_sujet

    return dict(
        nom="Poulet de chair — Togo", monnaie="FCFA", mis_en_place=mis_en_place, pu=pu, prix=prix_poulet,
        ca=ca, cv=cv, personnel=5.4, fixes=2.4, montee=0.8, cv_suit_ca=True,
        immos=[("Frais d'établissement", 0.5, 5), ("Bâtiments d'élevage (3 × 2 000 places)", 18.0, 20),
               ("Équipements (mangeoires, abreuvoirs, chauffage, bâches)", 6.0, 5), ("Forage, château d'eau et clôture", 3.5, 10),
               ("Imprévus (capitalisés)", 1.5, 10)],
        bfr=10.0, pct_apport=0.25, taux=0.09, duree=7, differe=1, **{"is": 0.30}, act=0.10,
        scen=dict(re=dict(), pe=dict(mort=0.02, aliment=1.04, prix=0.97), cr=dict(aliment=1.15, prix=0.96)),
    )


# ----------------------------------------------------------------------------------------------------------------
# CAS 2 — Transformation du manioc en attiéké, Côte d'Ivoire — FCFA
# ----------------------------------------------------------------------------------------------------------------
def attieke():
    jours, t_jour = 250, 1.2                    # 1,2 t de manioc frais transformées par jour, 250 jours/an
    manioc_t = jours * t_jour                    # 300 t/an
    rdt = 0.55                                   # kg d'attiéké pour 1 kg de manioc frais
    px_manioc, px_att = 0.000110, 0.000600       # M FCFA par kg : 110 FCFA/kg manioc, 600 FCFA/kg attiéké

    def ca(s):
        vol = manioc_t * 1000 * rdt * s.get("rdt", 1.0) * (1 - s.get("perte", 0.03))
        return vol * px_att * s.get("prix", 1.0)

    def cv(s):
        manioc = manioc_t * 1000 * px_manioc * s.get("manioc", 1.0)
        emball = manioc_t * 1000 * rdt * 0.000040           # 40 FCFA/kg d'emballage et d'étiquetage
        energie = 4.2 + 0.0                                    # gaz, eau et électricité
        mo = 11.0                                              # transformatrices et manutention (journalières)
        transport = 4.0
        return manioc + emball + energie + mo + transport

    return dict(
        nom="Attiéké — Côte d'Ivoire", monnaie="FCFA", manioc_t=manioc_t, rdt=rdt, px_manioc=px_manioc, px_att=px_att,
        ca=ca, cv=cv, personnel=7.2, fixes=3.6, montee=0.75, cv_suit_ca=True,
        immos=[("Frais d'établissement et agréments", 1.2, 5), ("Local de transformation et aire de séchage", 18.0, 20),
               ("Équipements (râpeuse, presse, cuiseur vapeur, trieuse)", 22.0, 8), ("Groupe électrogène, forage et réseau d'eau", 6.5, 8),
               ("Véhicule utilitaire", 6.0, 5), ("Imprévus (capitalisés)", 3.0, 10)],
        bfr=14.0, pct_apport=0.30, taux=0.09, duree=7, differe=1, **{"is": 0.25}, act=0.10,
        scen=dict(re=dict(), pe=dict(rdt=0.97, perte=0.05, prix=0.93, manioc=1.05), cr=dict(prix=0.80)),
    )


# ----------------------------------------------------------------------------------------------------------------
# CAS 3 — Maraîchage irrigué (tomate et chou), Bénin — FCFA (point 11, module « Maraîchage »)
# ----------------------------------------------------------------------------------------------------------------
def maraichage():
    ha_tomate, cycles_tomate, rdt_tomate, px_tomate = 1.5, 1, 25.0, 0.000250     # 1,5 ha, 1 cycle/an, 25 t/ha, 250 FCFA/kg
    ha_chou, cycles_chou, rdt_chou, px_chou = 1.5, 2, 30.0, 0.000180             # 1,5 ha, 2 cycles/an, 30 t/ha, 180 FCFA/kg
    perte = 0.10                                                                   # pertes après récolte (tri, transport, invendus)
    intrants_ha = dict(tomate=1.6, chou=1.0)                                       # M FCFA par hectare et par cycle

    def ca(s):
        t = ha_tomate * cycles_tomate * rdt_tomate * s.get("rdt", 1.0)
        c = ha_chou * cycles_chou * rdt_chou * s.get("rdt", 1.0)
        pert = perte + s.get("perte", 0.0)
        return (t * 1000 * px_tomate + c * 1000 * px_chou) * (1 - pert) * s.get("prix", 1.0)

    def cv(s):
        intr = (ha_tomate * cycles_tomate * intrants_ha["tomate"] + ha_chou * cycles_chou * intrants_ha["chou"]) * s.get("intrants", 1.0)
        return intr + 4.0 + 1.6 + 1.2          # + main-d'œuvre saisonnière 4,0 + caisses et transport 1,6 + eau et énergie 1,2

    return dict(
        nom="Maraîchage irrigué (tomate, chou) — Bénin", monnaie="FCFA", ca=ca, cv=cv, personnel=3.0, fixes=1.2, montee=0.85, cv_suit_ca=True,
        immos=[("Frais d'établissement", 0.3, 5), ("Forage, pompe solaire et goutte-à-goutte (3 ha)", 9.0, 8), ("Clôture", 2.0, 10),
               ("Magasin et aire de conditionnement", 3.5, 20), ("Motoculteur et petit matériel", 3.0, 5), ("Imprévus (capitalisés)", 1.0, 10)],
        bfr=4.0, pct_apport=0.30, taux=0.09, duree=7, differe=1, **{"is": 0.30}, act=0.10,
        scen=dict(re=dict(), pe=dict(rdt=0.95, prix=0.95, perte=0.02), cr=dict(prix=0.85)),
    )


# ----------------------------------------------------------------------------------------------------------------
# CAS 4 — Pisciculture de tilapia en étangs, Sénégal — FCFA (point 11, module « Aquaculture »)
# ----------------------------------------------------------------------------------------------------------------
def aquaculture():
    etangs, surface_etang, densite, cycles = 12, 500, 3.0, 2        # 12 étangs de 500 m², 3 alevins/m², 2 cycles/an
    alevins_cycle = etangs * surface_etang * densite                 # 18 000 alevins par cycle
    alevins_an = alevins_cycle * cycles                              # 36 000 alevins par an
    survie, poids, fcr = 0.85, 0.42, 1.6                             # survie 85 %, 420 g à la vente, indice de conversion 1,6
    px_kg, px_alevin, px_aliment = 0.002600, 0.000050, 0.000580      # M FCFA : 2 600 FCFA/kg de poisson, 50 FCFA/alevin, 580 FCFA/kg d'aliment

    def ca(s):
        vendus = alevins_an * (survie - s.get("mort", 0.0))
        return vendus * poids * px_kg * 1000 * s.get("prix", 1.0) / 1000

    def cv(s):
        vendus = alevins_an * survie                                  # l'aliment est acheté pour la production attendue
        aliment = vendus * poids * fcr * px_aliment * 1000 * s.get("aliment", 1.0) / 1000
        return aliment + alevins_an * px_alevin + 1.2 + 2.0 + 1.2 + 0.6   # + main-d'œuvre saisonnière, énergie, glace et transport, chaux et santé

    return dict(
        nom="Pisciculture de tilapia en étangs — Sénégal", monnaie="FCFA", etangs=etangs, surface_etang=surface_etang, densite=densite,
        cycles=cycles, alevins_an=alevins_an, survie=survie, poids=poids, fcr=fcr, px_kg=px_kg, px_alevin=px_alevin, px_aliment=px_aliment,
        ca=ca, cv=cv, personnel=4.8, fixes=1.8, montee=0.7, cv_suit_ca=True,
        immos=[("Frais d'établissement et autorisations", 0.5, 5), ("Creusement et aménagement de 12 étangs (6 000 m²)", 10.0, 20),
               ("Forage, pompe et réseau d'eau", 4.5, 10), ("Magasin d'aliment et local de conditionnement", 4.0, 20),
               ("Équipements (filets, balance, aérateurs, glacières)", 3.5, 5), ("Clôture et gardiennage", 1.5, 10), ("Imprévus (capitalisés)", 1.5, 10)],
        bfr=5.0, pct_apport=0.30, taux=0.09, duree=7, differe=1, **{"is": 0.30}, act=0.10,
        scen=dict(re=dict(), pe=dict(mort=0.05, aliment=1.08, prix=0.95), cr=dict(aliment=1.20, prix=0.95)),
    )


# ----------------------------------------------------------------------------------------------------------------
# CAS 5 — Séchage de mangues, Bénin — FCFA (point 11, module « Transformation et conditionnement »)
# ----------------------------------------------------------------------------------------------------------------
def mangue_sechee():
    jours, t_jour = 100, 1.8                      # campagne de 100 jours, 1,8 t de mangues fraîches traitées par jour
    mangue_t = jours * t_jour                      # 180 t/an
    rdt = 0.11                                     # kg de mangue séchée pour 1 kg de fruits frais
    px_mangue, px_sec = 0.000110, 0.004000         # M FCFA/kg : 110 FCFA/kg de fruits frais, 4 000 FCFA/kg de mangue séchée
    emballage_kg = 0.000300                        # 300 FCFA par kg de produit emballé

    def ca(s):
        vol = mangue_t * 1000 * rdt * s.get("rdt", 1.0) * (1 - s.get("perte", 0.04))
        return vol * px_sec * s.get("prix", 1.0)

    def cv(s):
        fruits = mangue_t * 1000 * px_mangue * s.get("mangue", 1.0)
        emball = mangue_t * 1000 * rdt * emballage_kg
        return fruits + emball + 5.0 + 11.0 + 3.0       # + énergie de séchage 5,0 + main-d'œuvre saisonnière 11,0 + transport et contrôles 3,0

    return dict(
        nom="Séchage de mangues — Bénin", monnaie="FCFA", mangue_t=mangue_t, rdt=rdt, px_mangue=px_mangue, px_sec=px_sec,
        ca=ca, cv=cv, personnel=7.2, fixes=3.6, montee=0.75, cv_suit_ca=True,
        immos=[("Frais d'établissement, agréments et certification", 2.0, 5), ("Local de transformation et magasin", 16.0, 20),
               ("Séchoirs (solaires et à gaz)", 22.0, 8), ("Lavage, épluchage, découpe et emballage", 11.0, 8),
               ("Véhicule utilitaire", 6.0, 5), ("Imprévus (capitalisés)", 3.0, 10)],
        bfr=14.0, pct_apport=0.30, taux=0.09, duree=7, differe=1, **{"is": 0.30}, act=0.10,
        scen=dict(re=dict(), pe=dict(rdt=0.97, perte=0.06, prix=0.95, mangue=1.08), cr=dict(prix=0.85)),
    )


def rapport(c):
    out = {}
    for k, s in c["scen"].items():
        out[k] = evalue(c, s)
    return out


def afficher(c, out):
    r = out["re"]
    print("=" * 78)
    print(c["nom"])
    print(f"Coût du projet {r['cout']:.1f} = immobilisations {r['immos']:.1f} + BFR {r['bfr']:.1f} ; apport {r['apport']:.1f} ; emprunt {r['emprunt']:.1f} ; annuité {r['annuite']:.2f}")
    print(f"CA croisière {r['ca']:.1f} ; charges variables {r['cv']:.1f} ; personnel {c['personnel']} ; fixes {c['fixes']} ; amortissements {r['amort']:.2f}")
    for y in r["res"]:
        print(f"  An{y['an']}: CA {y['ca']:.1f} EBE {y['ebe']:.1f} REX {y['rex']:.1f} RAI {y['rai']:.1f} IS {y['is_']:.1f} RN {y['rn']:.1f}")
    print(f"Seuil {r['seuil']:.1f} ({100 * r['seuil'] / r['ca']:.0f} % du CA) ; taux de marge {100 * r['tm']:.1f} % ; coûts fixes totaux {r['cf_tot']:.2f}")
    for k in ("re", "pe", "cr"):
        x = out[k]
        print(f"  {k}: CA {x['ca']:.1f} EBE A2 {x['res'][1]['ebe']:.1f} DSCR {x['dscr']:.2f} VAN {x['van']:.1f} TRI {100 * x['tri']:.1f} % payback {x['payback'] if x['payback'] is None else round(x['payback'], 1)}")
    print("  flux réaliste:", r["flux"])


if __name__ == "__main__":
    cas = {"poulet": poulet(), "attieke": attieke(), "maraichage": maraichage(), "aquaculture": aquaculture(), "mangue": mangue_sechee()}
    res = {k: rapport(c) for k, c in cas.items()}
    for k, c in cas.items():
        afficher(c, res[k])
    if "--json" in sys.argv:
        def clean(o):
            if isinstance(o, dict):
                return {a: clean(b) for a, b in o.items()}
            if isinstance(o, (list, tuple)):
                return [clean(a) for a in o]
            return o
        with open(sys.argv[sys.argv.index("--json") + 1], "w", encoding="utf-8") as f:
            json.dump(clean(res), f, ensure_ascii=False, indent=1)
