# Mot de passe admin et caractères spéciaux

Un mot de passe qui contient `#` peut être coupé dans un fichier `.env`, parce que `#` commence un commentaire.

## Solution

Mettez la valeur entre guillemets dans `.env.local` :

```env
ADMIN_PASSWORD="votre-mot-de-passe"
```

Les guillemets simples conviennent aussi :

```env
ADMIN_PASSWORD='votre-mot-de-passe'
```

## Après modification

1. Enregistrez `.env.local`.
2. Redémarrez le serveur de développement.

Ne réutilisez pas un ancien exemple de mot de passe qui aurait été écrit dans ce fichier. S’il a servi pour de vrai, changez-le.
