# Organisation des Données - Anim'Média

## 📁 Nouvelle Structure Optimisée

### 🗂️ **Fichiers de données :**

#### `content.json` - Données principales
- **Activités** : Liste des activités régulières de l'association
- **Événements** : Instances spécifiques des activités avec dates
- **Information association** : Coordonnées et présentation

#### `config.json` - Configuration
- **Paramètres du site** : URL, version, couleurs
- **Contact** : Coordonnées centralisées
- **Partenaires** : Liste des partenaires officiels
- **Réglages** : Limites, seuils, préférences

### 🔄 **Relation Activités ↔ Événements**

**Activité** = Template/modèle récurrent
```json
{
  "id": "cafe-numerique",
  "name": "Café numérique",
  "schedule": { "frequency": "weekly", "day": "mercredi" }
}
```

**Événement** = Instance spécifique d'une activité
```json
{
  "activity_id": "cafe-numerique",
  "date": "2024-09-04",
  "status": "scheduled"
}
```

### 📈 **Avantages de cette organisation :**

1. **Évite la duplication** : Une activité → plusieurs événements
2. **Cohérence** : Modifications d'activité répercutées automatiquement
3. **Flexibilité** : Événements spéciaux ou modifications ponctuelles
4. **Maintenance** : Plus facile à gérer

### 🗃️ **Anciens fichiers :**
- `backup/events-old.json` - Ancien fichier événements
- `backup/activities-old.json` - Ancien fichier activités

Ces fichiers sont conservés par sécurité mais ne sont plus utilisés.

### 🔧 **Mise à jour nécessaire :**
Les scripts JavaScript (`agenda.js`, `main.js`) doivent être mis à jour pour utiliser la nouvelle structure de données.

---
*Documentation mise à jour le 29/08/2025*
