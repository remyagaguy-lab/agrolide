import fs from 'fs';
import path from 'path';

const basePath = path.join(process.cwd(), 'src', 'app');

const updates = [
  {
    file: 'membres/forum/categorie/[id]/page.tsx',
    replace: /title:\s*['"`]Catégorie\s*\|\s*Forum Agrolide['"`]/,
    with: 'title: "Catégorie"'
  },
  {
    file: 'membres/forum/fil/[id]/page.tsx',
    replace: /title:\s*['"`]Sujet\s*\|\s*Forum Agrolide['"`]/,
    with: 'title: "Sujet"'
  },
  {
    file: 'membres/forum/nouveau/page.tsx',
    replace: /title:\s*['"`]Nouveau sujet\s*\|\s*Forum Agrolide['"`]/,
    with: 'title: "Nouveau sujet"'
  },
  {
    file: '(public)/agrobusiness/incubation/page.tsx',
    replace: /title:\s*["']Incubation["']/,
    with: 'title: "Programme d\'Incubation"'
  },
  {
    file: '(public)/annuaire/page.tsx',
    replace: /title:\s*["']Annuaire des Membres["']/,
    with: 'title: "Annuaire du réseau"'
  },
  {
    file: 'admin/dashboard/page.tsx',
    replace: /title:\s*["']Dashboard Admin["']/,
    with: 'title: "Tableau de bord"'
  },
  {
    file: 'admin/contenus/partenaires/page.tsx',
    replace: /title:\s*["']Partenaires["']/,
    with: 'title: "Gestion des partenaires"'
  },
  {
    file: 'admin/membres/page.tsx',
    replace: /title:\s*["']Gestion membres["']/,
    with: 'title: "Gestion des membres"'
  }
];

updates.forEach(u => {
  const filePath = path.join(basePath, u.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (u.replace.test(content)) {
      content = content.replace(u.replace, u.with);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
    }
  }
});
