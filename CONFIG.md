# Configuration

## Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Resend API Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=contact@punkhazard.org
RESEND_TO_EMAIL=contact@punkhazard.org

# Contact Email (fallback)
NEXT_PUBLIC_CONTACT_EMAIL=contact@punkhazard.org

# NextAuth.js Configuration
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials (pour l'authentification par email/password)
ADMIN_EMAIL=admin@pigeons.studio
ADMIN_PASSWORD=your-secure-password

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Search Console (optionnel)
# Uniquement le token, pas la balise <meta> complète
GOOGLE_SITE_VERIFICATION=your-google-site-verification-token
```

## Configuration Resend

1. Créez un compte sur [Resend](https://resend.com)
2. Générez une clé API
3. Ajoutez la clé dans `RESEND_API_KEY`
4. Configurez votre domaine d'envoi dans Resend
5. Mettez à jour `RESEND_FROM_EMAIL` avec votre email vérifié

### Répondre aux emails de contact

Le formulaire de contact est configuré pour faciliter les réponses :

- **Répondre directement** : Quand vous recevez un email de contact, cliquez simplement sur "Répondre" dans votre client email (Gmail, Outlook, etc.). L'email sera automatiquement envoyé au client qui a rempli le formulaire.
- **Format des emails** : Les emails reçus contiennent toutes les informations du formulaire (nom, email, sujet, message) dans un format clair et structuré.
- **Sujet des emails** : Les emails sont préfixés avec `[Contact]` pour faciliter le tri dans votre boîte de réception.

## Google Search Console (`GOOGLE_SITE_VERIFICATION`)

Cette variable sert à **prouver à Google que vous êtes propriétaire du site**. Next.js l’injecte dans le `<head>` sous la forme :

```html
<meta name="google-site-verification" content="VOTRE_TOKEN" />
```

Sans ce token, Google Search Console ne peut pas valider la propriété du domaine (méthode « balise HTML »). Ce n’est **pas** lié à Google OAuth (`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`).

### Obtenir le token

L’écran actuel de Search Console **n’affiche pas « Balise HTML » en premier**. La méthode recommandée est « Fichier HTML ». La balise meta est cachée plus bas.

1. Ouvrez [Google Search Console](https://search.google.com/search-console)
2. Cliquez sur **Ajouter une propriété** (sélecteur de propriété en haut à gauche → **Ajouter une propriété**)
3. L’écran propose **deux cartes**. Prenez celle de **droite** : **Préfixe d’URL**
   - **Ne prenez pas** la carte de gauche **Domaine** (`pigeons.studio`) : elle ne propose que la validation DNS, jamais la balise HTML
4. Saisissez l’URL complète, avec `https://`, par exemple :
   ```
   https://pigeons.studio
   ```
   Puis **Continuer**
5. Search Console propose d’abord **Fichier HTML** (méthode recommandée). **Ignorez-la**.
6. Faites défiler jusqu’à **Autres méthodes de validation** (parfois **Autres méthodes de vérification** ; en anglais : *Other verification methods*)
7. Cliquez sur **Balise HTML** (*HTML tag*)
8. Google affiche une balise du type :
   ```html
   <meta name="google-site-verification" content="AbCdEfGhIjKlMnOpQrStUvWxYz0123456789" />
   ```
9. Copiez **uniquement** la valeur de `content` (ici `AbCdEfGhIjKlMnOpQrStUvWxYz0123456789`), pas la balise entière

Si vous avez déjà créé une propriété **Domaine**, ajoutez une **nouvelle** propriété en **Préfixe d’URL**. Vous ne pourrez pas basculer vers la balise HTML sur la propriété Domaine.

**La propriété est déjà dans Search Console** (écran Overview, Performance / Indexing) : le wizard d’ajout n’apparaît plus. Pour récupérer le token :

1. Dans le menu de gauche, cliquez sur **Settings** (engrenage, tout en bas)
2. Ouvrez **Ownership verification** (Validation de la propriété)
3. Dépliez **Balise HTML** / **HTML tag**
4. Copiez uniquement la valeur `content=` de la balise affichée

### Renseigner la variable

Dans `.env.local` (développement) et dans **Vercel → Settings → Environment Variables** (production) :

```env
GOOGLE_SITE_VERIFICATION=AbCdEfGhIjKlMnOpQrStUvWxYz0123456789
```

Redéployez ensuite le site. Search Console vérifie la **page en ligne** : le token doit donc être présent en production avant de cliquer sur **Valider**.

### Après validation

1. Dans Search Console, cliquez sur **Valider**
2. Soumettez le sitemap : `https://pigeons.studio/sitemap.xml`
3. Vous pouvez laisser `GOOGLE_SITE_VERIFICATION` en place : Google peut revérifier la propriété plus tard

### Dépannage

- **« Balise de validation introuvable »** : le token n’est pas encore déployé, ou vous avez collé la balise HTML entière au lieu du seul token
- **Mauvais type de propriété** : utilisez « Préfixe d’URL » (`https://pigeons.studio`) pour cette méthode. La propriété « Domaine » (`pigeons.studio`) se valide par DNS, pas par cette variable
- **www vs sans www / http vs https** : l’URL de la propriété doit correspondre exactement à celle servie en production

## Internationalisation (i18n)

Le site supporte le français (fr) et l'anglais (en) via `next-intl`.

### Structure des traductions

Les fichiers de traduction se trouvent dans `/messages/` :
- `fr.json` - Traductions françaises
- `en.json` - Traductions anglaises

### URLs

Les pages sont accessibles avec le préfixe de langue :
- `/fr/` - Version française (par défaut)
- `/en/` - Version anglaise
- `/` - Redirige automatiquement vers `/fr/`

### Ajouter une traduction

1. Ajoutez la clé dans `messages/fr.json`
2. Ajoutez la même clé dans `messages/en.json`
3. Utilisez `useTranslations('namespace')` dans vos composants

## Authentification (NextAuth.js)

Le site utilise NextAuth.js pour l'authentification. Deux méthodes sont disponibles :

1. **Email/Password** : Utilise les variables `ADMIN_EMAIL` et `ADMIN_PASSWORD`
2. **Google OAuth** : Nécessite la configuration de Google OAuth (optionnel)

### 📖 Guide complet de configuration

Pour un guide détaillé étape par étape avec Google Workspace, consultez **[SETUP_AUTH.md](./SETUP_AUTH.md)**.

### Configuration rapide

1. Générez un secret pour `NEXTAUTH_SECRET` :
   ```bash
   openssl rand -base64 32
   ```

2. Pour Google OAuth :
   - Créez un projet sur [Google Cloud Console](https://console.cloud.google.com/)
   - Activez l'API Google+ / Google Identity
   - Créez des identifiants OAuth 2.0
   - Ajoutez `http://localhost:3000/api/auth/callback/google` comme URI de redirection

3. Pour Google Search Console (`GOOGLE_SITE_VERIFICATION`) :
   - Voir la section [Google Search Console](#google-search-console-google_site_verification) ci-dessus
   - Coller uniquement le token de la balise HTML, puis déployer avant de valider

### Base de données (optionnel)

Pour un vrai système de gestion d'utilisateurs, vous pouvez :
- Utiliser **Supabase** (PostgreSQL serverless)
- Utiliser **MongoDB Atlas** (MongoDB serverless)
- Utiliser **Vercel KV** (Redis serverless)

Modifiez `app/api/auth/[...nextauth]/route.ts` pour intégrer votre base de données.

## Panier (Cart)

Le panier utilise **Zustand** avec persistance dans `localStorage`. Les données sont stockées localement dans le navigateur.

Pour synchroniser le panier avec un backend :
1. Créez une API route `/api/cart` pour sauvegarder le panier
2. Modifiez `app/store/cartStore.ts` pour synchroniser avec l'API

### Exemple

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('home');
  return <h1>{t('title')}</h1>;
}
```

## Pages disponibles

- `/fr/` ou `/en/` - Page d'accueil
- `/fr/boutique` ou `/en/shop` - Catalogue produits
- `/fr/services` ou `/en/services` - Services proposés
- `/fr/projets` ou `/en/projects` - Projets et réalisations
- `/fr/contact` ou `/en/contact` - Formulaire de contact
- `/fr/a-propos` ou `/en/about` - À propos
- `/fr/cgv` ou `/en/terms` - Conditions générales de vente
- `/fr/mentions-legales` ou `/en/legal` - Mentions légales
