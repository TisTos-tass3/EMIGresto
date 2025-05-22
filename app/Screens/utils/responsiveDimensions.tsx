import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const baseDesignWidth = 412; // La largeur de votre design de référence
const baseDesignHeight = 915; // La hauteur de votre design de référence

const widthRatio = screenWidth / baseDesignWidth;
const heightRatio = screenHeight / baseDesignHeight;

// Export all calculated values
export const responsive = {
  screenWidth,
  screenHeight,
  widthRatio,
  heightRatio,

  // Global paddings and margins
  paddingHorizontal: 20 * widthRatio,
  paddingTop: (20 * widthRatio) / 5,

  // OptionBox sizes
  optionBoxWidth: 44 * widthRatio * 4,
  optionBoxHeight: 44 * heightRatio * 4,
  optionBoxSpacing: 16 * heightRatio, // Espacement vertical entre les lignes d'OptionBox

  // Expandable section
  expandablePadding: 8 * widthRatio,
  expandableMarginTop: 20 * heightRatio,
  expandableMarginHorizontal: 4 * widthRatio,
  borderRadiusExpandable: 16 * widthRatio,

  // RepasBox styles
  repasBoxMarginBottom: 4 * heightRatio,
  repasBoxTitleFontSize: 14 * widthRatio,
  repasBoxTitleMarginBottom: 12 * heightRatio,
  repasBoxTitleMarginTop: 4 * heightRatio,
  jourBoxRadius: 12 * widthRatio,
  jourBoxPaddingH: 8 * widthRatio,
  jourBoxPaddingV: 8 * heightRatio,
  jourBoxMarginH: 4 * widthRatio,
  jourFontSize: 14 * widthRatio,

  // Bottom menu height
  baseExpandedHeight: 160,
  get proportionalExpandedHeight() {
    return this.baseExpandedHeight * heightRatio;
  },

  iconSize: 24 * widthRatio,
  iconPadding: 8 * widthRatio,
  iconBorderRadius: (50 / 2) * widthRatio,
  iconCircleSize: 50 * widthRatio, // Taille du cercle blanc autour de l'icône
  iconMarginBottom: 10 * heightRatio,
  optionBoxRadius: 12 * widthRatio,
  optionBoxPadding: 16 * widthRatio,

  // Nouvelles propriétés pour le comportement de défilement
  bottomNavBarHeight: 56 * heightRatio, // Hauteur estimée de votre barre de navigation inférieure
  paddingBottomForScroll: 20 * heightRatio, // Espace supplémentaire au bas de la ScrollView pour le confort

  // PROPRIÉTÉS POUR LA SECTION DU HAUT (COMPTE ET TICKETS RESTANTS)
  headerPaddingVertical: 20 * heightRatio, // py-5
  headerPaddingHorizontal: 12 * widthRatio, // px-3
  headerGreetingMarginBottom: 32 * heightRatio, // mb-8
  headerAccountMarginBottom: 8 * heightRatio, // mb-2
  headerAccountTextOpacityMarginBottom: 4 * heightRatio, // mb-1
  headerGreetingFontSize: 16 * widthRatio, // text-base
  headerAccountTitleFontSize: 12 * widthRatio, // text-xs
  headerAccountAmountFontSize: 24 * widthRatio, // text-2xl
  headerAccountAmountMarginBottom: 16 * heightRatio, // mb-4

  ticketsBoxMarginHorizontal: 48 * widthRatio, // mx-12
  ticketsBoxPaddingVertical: 8 * heightRatio, // py-2
  ticketsBoxPaddingHorizontal: 12 * widthRatio, // p-3 (combined)
  ticketsBoxMarginTop: -32 * heightRatio, // -mt-8 (négatif)
  ticketsBoxRadius: 12 * widthRatio, // rounded-xl
  ticketsBoxTextTracking: 0.05 * widthRatio, // tracking-widest (valeur approximative)
  ticketsBoxTextFontSize: 10 * widthRatio, // text-[10px]
  ticketsBoxAmountFontSize: 20 * widthRatio, // text-xl
  ticketsBoxSpaceY: 8 * heightRatio, // space-y-2

  // PROPRIÉTÉS POUR "Réservation de la semaine"
  reservationTitleMarginTop: 24 * heightRatio, // mt-6
  reservationTitleFontSize: 12 * widthRatio, // text-xs
  reservationTitleLetterSpacing: 0.05 * widthRatio, // tracking-widest (valeur approximative)

  // NOUVELLES PROPRIÉTÉS POUR LA BARRE DE NAVIGATION INFÉRIEURE
  bottomNavPaddingVertical: 12 * heightRatio, // py-3
  bottomNavIconSize: 28 * widthRatio, // size={28}
  borderTopLeftRadius: 30, // Ajoutez ici un rayon pour le coin supérieur gauche
  borderTopRightRadius: 30, // Ajoutez ici un rayon pour le coin supérieur droit
   
   // PROPRIÉTÉS MANQUANTES (à ajouter ou ajuster)
   
};