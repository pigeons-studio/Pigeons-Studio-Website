# Guide de configuration - Authentification NextAuth.js avec Google Workspace

Ce guide vous explique comment configurer l'authentification NextAuth.js avec Google OAuth en utilisant votre Google Workspace, étape par étape, en sécurisant vos données.

## 📋 Prérequis

- Un compte Google Workspace avec accès administrateur
- Un domaine configuré (ex: `pigeons.studio`)
- Accès à la Google Cloud Console

---

## 🔐 Étape 1 : Générer le secret NextAuth

Le `NEXTAUTH_SECRET` est utilisé pour chiffrer les tokens JWT. **Ne le partagez jamais** et générez-en un nouveau pour chaque environnement.

### Génération du secret

```bash
openssl rand -base64 32
```

**Exemple de sortie :**
```
aBc123XyZ456DeF789GhI012JkL345MnO678PqR901StU234VwX567YzA890=
```

**⚠️ Important :** Copiez ce secret et gardez-le en sécurité. Vous en aurez besoin pour l'étape suivante.

---

## 🌐 Étape 2 : Configurer Google OAuth dans Google Cloud Console

### 2.1 Créer ou sélectionner un projet

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google Workspace
3. Cliquez sur le sélecteur de projet en haut
4. Cliquez sur **"Nouveau projet"** ou sélectionnez un projet existant
5. Donnez un nom au projet (ex: "Punk Hazard Website")
6. Cliquez sur **"Créer"**

### 2.2 Activer l'API Google+

1. Dans le menu latéral, allez dans **"APIs & Services"** > **"Library"**
2. Recherchez **"Google+ API"** ou **"Google Identity"**
3. Cliquez sur **"Enable"** pour activer l'API

### 2.3 Configurer l'écran de consentement OAuth

1. Allez dans **"APIs & Services"** > **"OAuth consent screen"**
2. Sélectionnez **"Internal"** (pour Google Workspace uniquement) ou **"External"** (si vous voulez permettre à des utilisateurs externes)
3. Remplissez les informations :
   - **App name** : `Punk Hazard`
   - **User support email** : Votre email (ex: `contact@punkhazard.org`)
   - **Developer contact information** : Votre email
4. Cliquez sur **"Save and Continue"**
5. Pour les scopes, vous pouvez laisser les valeurs par défaut
6. Cliquez sur **"Save and Continue"** jusqu'à la fin

### 2.4 Créer les identifiants OAuth 2.0

1. Allez dans **"APIs & Services"** > **"Credentials"**
2. Cliquez sur **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Sélectionnez **"Web application"** comme type d'application
4. Donnez un nom (ex: "Punk Hazard Web Client")
5. **Authorized JavaScript origins** :
   ```
   http://localhost:3000
   https://votre-domaine.com
   ```
   (Remplacez `votre-domaine.com` par votre domaine réel, ex: `pigeons.studio`)
6. **Authorized redirect URIs** :
   ```
   http://localhost:3000/api/auth/callback/google
   https://votre-domaine.com/api/auth/callback/google
   ```
7. Cliquez sur **"Create"**
8. **⚠️ IMPORTANT :** Copiez immédiatement le **Client ID** et le **Client Secret** affichés
   - Vous ne pourrez plus voir le Client Secret après avoir fermé cette fenêtre
   - Si vous le perdez, vous devrez créer de nouveaux identifiants

---

## 📝 Étape 3 : Créer le fichier .env.local

### 3.1 Créer le fichier

À la racine du projet, créez un fichier `.env.local` :

```bash
touch .env.local
```

### 3.2 Ajouter les variables d'environnement

Ouvrez `.env.local` et ajoutez :

```env
# NextAuth.js Configuration
NEXTAUTH_SECRET=votre-secret-genere-etape-1
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials (pour l'authentification par email/password)
ADMIN_EMAIL=admin@pigeons.studio
ADMIN_PASSWORD=votre-mot-de-passe-securise

# Google OAuth (depuis Google Cloud Console)
GOOGLE_CLIENT_ID=votre-client-id-copie-etape-2
GOOGLE_CLIENT_SECRET=votre-client-secret-copie-etape-2
```

**Remplacez :**
- `votre-secret-genere-etape-1` : Le secret généré à l'étape 1
- `admin@pigeons.studio` : Votre email admin
- `votre-mot-de-passe-securise` : Un mot de passe fort (minimum 12 caractères, avec majuscules, minuscules, chiffres et symboles)
- `votre-client-id-copie-etape-2` : Le Client ID copié à l'étape 2.4
- `votre-client-secret-copie-etape-2` : Le Client Secret copié à l'étape 2.4

---

## 🔒 Étape 4 : Sécuriser vos données

### 4.1 Vérifier que .env.local est ignoré par Git

Vérifiez que `.gitignore` contient :

```
.env*
```

✅ Le fichier `.gitignore` contient déjà cette ligne, vos secrets sont protégés.

### 4.2 Ne jamais commiter .env.local

**⚠️ JAMAIS :**
- Commiter `.env.local` dans Git
- Partager vos secrets par email ou chat
- Les mettre dans des fichiers de documentation publics

### 4.3 Pour la production (Vercel)

Quand vous déployez sur Vercel :

1. Allez dans votre projet Vercel
2. **Settings** > **Environment Variables**
3. Ajoutez toutes les variables de `.env.local` une par une
4. Pour `NEXTAUTH_URL`, utilisez votre domaine de production :
   ```
   https://pigeons.studio
   ```
5. Pour les **Authorized redirect URIs** dans Google Cloud Console, ajoutez aussi :
   ```
   https://pigeons.studio/api/auth/callback/google
   ```

### 4.4 Bonnes pratiques de sécurité

1. **Mots de passe forts** :
   - Minimum 12 caractères
   - Utilisez un gestionnaire de mots de passe (1Password, Bitwarden, etc.)
   - Ne réutilisez jamais le même mot de passe

2. **Secrets différents par environnement** :
   - Un `NEXTAUTH_SECRET` pour le développement
   - Un autre `NEXTAUTH_SECRET` pour la production
   - Générés avec `openssl rand -base64 32`

3. **Rotation des secrets** :
   - Changez `ADMIN_PASSWORD` régulièrement
   - Si un secret est compromis, régénérez-le immédiatement

4. **Accès limité** :
   - Seuls les administrateurs doivent avoir accès à `.env.local`
   - Utilisez des permissions de fichiers restrictives :
     ```bash
     chmod 600 .env.local
     ```

---

## ✅ Étape 5 : Tester la configuration

### 5.1 Redémarrer le serveur de développement

```bash
pnpm run dev
```

### 5.2 Tester l'authentification

1. Allez sur `http://localhost:3000`
2. Cliquez sur le bouton **"Connexion"** dans le header
3. Vous devriez voir deux options :
   - **Email/Password** : Utilisez `ADMIN_EMAIL` et `ADMIN_PASSWORD`
   - **Google** : Cliquez pour vous connecter avec votre compte Google Workspace

### 5.3 Vérifier les logs

Si vous avez des erreurs, vérifiez :
- Que toutes les variables sont bien définies dans `.env.local`
- Que les URLs de redirection dans Google Cloud Console correspondent
- Que l'API Google+ est bien activée

---

## 🚀 Étape 6 : Configuration pour la production

### 6.1 Mettre à jour NEXTAUTH_URL

Dans Vercel, ajoutez/modifiez :

```env
NEXTAUTH_URL=https://pigeons.studio
```

### 6.2 Ajouter les URLs de production dans Google Cloud Console

Dans **"Authorized JavaScript origins"** :
```
https://pigeons.studio
```

Dans **"Authorized redirect URIs"** :
```
https://pigeons.studio/api/auth/callback/google
```

### 6.3 Vérifier le DNS

Assurez-vous que votre domaine pointe bien vers Vercel :
- Vérifiez les enregistrements DNS dans votre Google Workspace
- Ajoutez les enregistrements CNAME ou A selon la configuration Vercel

---

## 🆘 Dépannage

### Erreur : "Invalid client secret"

- Vérifiez que `GOOGLE_CLIENT_SECRET` est correctement copié (sans espaces)
- Vérifiez que les URLs de redirection correspondent exactement

### Erreur : "redirect_uri_mismatch"

- Vérifiez que l'URL dans Google Cloud Console correspond exactement à celle utilisée
- Les URLs doivent correspondre caractère par caractère (http vs https, avec/sans trailing slash)

### Erreur : "NEXTAUTH_SECRET is not set"

- Vérifiez que `.env.local` existe à la racine du projet
- Vérifiez que `NEXTAUTH_SECRET` est bien défini
- Redémarrez le serveur de développement

### L'authentification Google ne fonctionne pas

- Vérifiez que l'API Google+ est activée
- Vérifiez que l'écran de consentement OAuth est configuré
- Vérifiez que vous utilisez le bon type de compte (Workspace vs Gmail personnel)

---

## 📚 Ressources

- [Documentation NextAuth.js](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🔐 Checklist de sécurité

- [ ] `.env.local` est dans `.gitignore`
- [ ] `NEXTAUTH_SECRET` est généré avec `openssl rand -base64 32`
- [ ] `ADMIN_PASSWORD` est un mot de passe fort (12+ caractères)
- [ ] Les secrets de production sont différents de ceux de développement
- [ ] Les URLs de redirection sont correctement configurées dans Google Cloud Console
- [ ] Les permissions du fichier `.env.local` sont restrictives (`chmod 600`)
- [ ] Les variables d'environnement sont configurées dans Vercel pour la production
