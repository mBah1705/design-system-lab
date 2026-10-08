# design-system-lab
Librairie de composants Angular accessibles, basée sur du HTML sémantique et les primitives Angular CDK, sans dépendance à une librairie UI. WCAG 2.1 AA, zoneless, Signals, Vitest + axe-core. Laboratoire d'apprentissage autour de la migration d'un design system hors de PrimeNG.

Laboratoire d'apprentissage : une petite librairie de composants Angular accessibles, construite sans UI framework, uniquement avec du HTML sémantique et les primitives comportementales d'Angular CDK.

## Objectifs
- Remplacer un composant « prêt à l'emploi » par un composant maison, en maîtrisant focus, clavier et rôles ARIA
- Viser la conformité WCAG 2.1 niveau AA, vérifiée par des tests automatisés (axe-core) et un passage manuel (clavier, lecteur d'écran)
- Tests unitaires Vitest en environnement zoneless
- Packaging avec ng-packagr sous Bun, app de démo (showcase)

## Composants
| Composant | Pattern WAI-ARIA | Statut |
|---|---|---|
| Dialog (modal) | Modal Dialog | en cours |
| Menu / Listbox | Menu Button / Listbox | à venir |
| Table triable | Table (tri, `aria-sort`) | à venir |
| Select | Listbox / Combobox | à venir |

## Décisions d'architecture
Les choix de conception (ex. `<dialog>` natif vs CDK Overlay) sont documentés dans `docs/adr/`.

## Stack
Angular, TypeScript, Angular CDK, SCSS, Vitest, axe-core, ng-packagr, Bun

## Démarrer
(à compléter : installation, `ng test`, `ng build ds-core`, app showcase)
