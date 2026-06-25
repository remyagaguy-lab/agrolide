INSERT INTO forum_categories (nom, ordre) VALUES
  ('Réseau & communauté', 1),
  ('Formation & savoirs', 2),
  ('Entrepreneuriat agricole', 3),
  ('Recherche & vulgarisation', 4),
  ('Opportunités', 5),
  ('Annonces', 6)
ON CONFLICT (nom) DO NOTHING;
