# Guide d'Administration - Anim'Média

## 🎯 Interface d'Administration

L'interface d'administration (`admin.html`) permet de gérer facilement les événements sans connaître le code.

### 📝 **Accès à l'interface**
- Ouvrez le fichier `admin.html` dans votre navigateur
- Aucun serveur web requis, fonctionne en local

### ➕ **Ajouter un événement**
1. Remplissez le formulaire :
   - **Titre** : Nom de l'événement
   - **Date** : Date de l'événement  
   - **Heure** : Heure de début
   - **Lieu** : Adresse ou nom du lieu
   - **Description** : Détails de l'événement
   - **Catégorie** : Type d'activité
   - **Âge** : Tranche d'âge recommandée
   - **Places** : Nombre de places disponibles
   - **Prix** : Tarif (optionnel)

2. Cliquez sur **"Ajouter l'événement"**

### ✏️ **Modifier un événement**
1. Cliquez sur **"Modifier"** dans la liste
2. Les informations se chargent dans le formulaire
3. Modifiez les champs souhaités
4. Cliquez sur **"Mettre à jour l'événement"**

### 🗑️ **Supprimer un événement**
1. Cliquez sur **"Supprimer"** dans la liste
2. Confirmez la suppression

### 👁️ **Aperçu et brouillons**
- **Aperçu** : Visualisez l'événement tel qu'il apparaîtra sur le site
- **Brouillons** : Sauvegardez des événements en cours de création

### 📊 **Statistiques**
L'interface affiche :
- Nombre total d'événements
- Événements à venir
- Répartition par catégorie
- Places disponibles

### 💾 **Sauvegarde automatique**
- Les données sont sauvegardées automatiquement
- Fichier de données : `data/events.json`
- Pensez à faire des sauvegardes régulières

### 🔧 **Conseils d'utilisation**
- Utilisez des titres courts et descriptifs
- Ajoutez toujours une description détaillée
- Vérifiez les dates et heures
- Catégorisez correctement vos événements
- Indiquez le nombre de places pour la gestion des inscriptions

### 🆘 **En cas de problème**
Si l'interface ne fonctionne pas :
1. Vérifiez que le fichier `data/events.json` existe
2. Assurez-vous que votre navigateur autorise JavaScript
3. Consultez la console du navigateur (F12) pour les erreurs

---
*Interface créée pour faciliter la gestion des événements Anim'Média*
