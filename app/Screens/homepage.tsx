import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient'; // Importez LinearGradient
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import ReloadBottomSheet from './Components/sheets/RechargeSheet';
import ReserveBottomSheet from './Components/sheets/ReservationSheet';
import TicketBottomSheet from './Components/sheets/TicketSheet';

import { responsive as r } from './utils/responsiveDimensions';

const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const RepasBox = ({ titre, joursActifs }: { titre: string; joursActifs: string[] }) => (
  <View style={{ marginBottom: r.repasBoxMarginBottom }}>
    <Text
      style={{
        fontSize: r.repasBoxTitleFontSize,
        marginBottom: r.repasBoxTitleMarginBottom,
        marginTop: r.repasBoxTitleMarginTop,
      }}
      className="text-white text-center font-bold"
    >
      {titre}
    </Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: r.jourBoxPaddingH / 2 }}>
      {jours.map((jour) => (
        <View
          key={jour}
          style={{
            borderRadius: r.jourBoxRadius,
            paddingHorizontal: r.jourBoxPaddingH,
            paddingVertical: r.jourBoxPaddingV,
            marginHorizontal: r.jourBoxMarginH,
            backgroundColor: joursActifs.includes(jour) ? '#dc2626' : 'rgba(255,255,255,0.4)',
          }}
        >
          <Text
            style={{
              fontSize: r.jourFontSize,
              textAlign: 'center',
              color: joursActifs.includes(jour) ? '#ffffff' : 'rgba(255,255,255,0.8)',
              fontWeight: joursActifs.includes(jour) ? 'bold' : 'normal',
            }}
          >
            {jour}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

const bgColors: {
  [key: string]: {
    start: string;
    end: string;
    iconColor?: string; // Rend iconColor optionnel
  };
} = {
  primary100: { start: '#e0f2fe', end: '#bfdbfe' }, // Light blue for gradient
  primary200: { start: '#bfdbfe', end: '#93c5fd' },
  primary300: { start: '#93c5fd', end: '#60a5fa' },
  primary400: { start: '#60a5fa', end: '#3b82f6' },
  primary500: { start: '#3b82f6', end: '#2563eb' }, // Main blue
  primary600: { start: '#2563eb', end: '#1d4ed8' },
  primary700: { start: '#1d4ed8', end: '#1e40af' }, // Darkest blue

  // Couleurs très claires avec un gradient subtil pour les OptionBox
  VeryLightRed: { start: '#FFF0F5', end: '#FFE8EE', iconColor: '#DC143C' }, // LavenderBlush + un rouge plus visible pour l'icône
  VeryLightYellow: { start: '#FFFFF0', end: '#FFFACD', iconColor: '#DAA520' }, // Ivory + un jaune plus visible
  VeryLightGreen: { start: '#F0FFF0', end: '#E0FFEB', iconColor: '#228B22' }, // Honeydew + un vert plus visible
  VeryLightPurple: { start: '#F8F8FF', end: '#F0F0FF', iconColor: '#8A2BE2' }, // GhostWhite + un violet plus visible
  VeryLightBlue: { start: '#F0F8FF', end: '#E6F0FF', iconColor: '#1E90FF' }, // AliceBlue + un bleu plus visible
};

const OptionBox = ({
  iconName,
  titre,
  sousTitre,
  bgColor,
  onPress,
  iconColor, // Ajout de la prop iconColor
}: {
  iconName: keyof typeof Entypo.glyphMap;
  titre: string;
  sousTitre?: string;
  bgColor: keyof typeof bgColors;
  onPress?: () => void;
  iconColor: string; // Type pour la couleur de l'icône
}) => {
  const colors = bgColors[bgColor];
  // La couleur de l'icône est maintenant passée directement, pas besoin de la calculer ici.

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: r.optionBoxWidth,
        height: r.optionBoxHeight,
        borderRadius: r.optionBoxRadius,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
      }}
    >
      <LinearGradient
        colors={[colors.start, colors.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: r.optionBoxRadius,
          padding: r.optionBoxPadding,
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: r.iconBorderRadius,
            padding: r.iconPadding,
            marginBottom: r.iconMarginBottom,
            alignItems: 'center',
            justifyContent: 'center',
            width: r.iconCircleSize,
            height: r.iconCircleSize,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <Entypo name={iconName} size={r.iconSize} color={iconColor} />
        </View>
        <Text
          style={{
            color: iconColor, // Utilisez la couleur de l'icône pour le titre
            fontWeight: 'semibold',
            textAlign: 'center',
            fontSize: 20, // Correspond à 'text-xl'
          }}
        >
          {titre}
        </Text>
        {sousTitre && (
          <Text className="text-blue-900 text-center text-xs mt-1" numberOfLines={2} ellipsizeMode="tail">
            {sousTitre}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Homepage() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'home' | 'notif' | 'profile'>('home');
  const animation = useRef(new Animated.Value(0)).current;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isTicketModalVisible, setTicketModalVisible] = useState(false);
  const [isReserveModalVisible, setReserveModalVisible] = useState(false);
  const [isReloadModalVisible, setReloadModalVisible] = useState(false);

  const toggleTicketModal = () => setTicketModalVisible(!isTicketModalVisible);
  const toggleReserveModal = () => setReserveModalVisible(!isReserveModalVisible);
  const toggleReloadModal = () => setReloadModalVisible(!isReloadModalVisible);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const menuHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, r.proportionalExpandedHeight],
  });

  const marginTopAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 20],
  });

  const toggleBottomSheet = () => setModalVisible((prev) => !isModalVisible);

  return (
    <View className="flex-1 bg-white relative">
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION DU HAUT : Compte utilisateur */}
        <View
          style={{
            backgroundColor: '#2563eb', // Couleur unie
            borderBottomLeftRadius: r.borderRadiusExpandable,
            borderBottomRightRadius: r.borderRadiusExpandable,
            paddingHorizontal: r.headerPaddingHorizontal,
            paddingVertical: r.headerPaddingVertical,
            shadowColor: '#000', // Ombre
            shadowOffset: { width: 0, height: 4 }, // Ombre
            shadowOpacity: 0.3, // Ombre
            shadowRadius: 6, // Ombre
            elevation: 8, // Ombre pour Android
          }}
        >
          <View style={{ marginBottom: r.headerGreetingMarginBottom }}>
            <Text style={{ fontSize: r.headerGreetingFontSize }} className="text-white">Bonjour Mohammed,</Text>
          </View>
          <View style={{ marginBottom: r.headerAccountMarginBottom }}>
            <Text style={{ fontSize: r.headerAccountTitleFontSize, marginBottom: r.headerAccountTextOpacityMarginBottom }} className="text-white opacity-80">COMPTE</Text>
            <Text style={{ fontSize: r.headerAccountAmountFontSize, marginBottom: r.headerAccountAmountMarginBottom }} className="text-white font-bold">FCFA 10 000</Text>
          </View>
        </View>

        {/* BLOC TICKETS RESTANTS */}
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: r.ticketsBoxMarginHorizontal,
            paddingVertical: r.ticketsBoxPaddingVertical,
            paddingHorizontal: r.ticketsBoxPaddingHorizontal,
            borderRadius: r.ticketsBoxRadius,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            marginTop: r.ticketsBoxMarginTop,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              color: '#6b7280',
              fontSize: r.ticketsBoxTextFontSize,
              textAlign: 'center',
              letterSpacing: r.ticketsBoxTextTracking,
            }}
          >
            TICKETS RESTANTS
          </Text>
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: r.ticketsBoxAmountFontSize,
              textAlign: 'center',
              marginTop: r.ticketsBoxSpaceY / 2,
            }}
          >
            30 TICKETS
          </Text>
        </View>

        {/* SECTION "Réservation de la semaine" */}
        <Text
          style={{
            textAlign: 'center',
            color: '#9ca3af',
            marginTop: r.reservationTitleMarginTop,
            fontSize: r.reservationTitleFontSize,
            textTransform: 'uppercase',
            letterSpacing: r.reservationTitleLetterSpacing,
          }}
        >
          Réservation de la semaine
        </Text>

        {/* MENU DÉROULANT */}
        <View
          style={{
            backgroundColor: '#2563eb', // Couleur unie
            borderRadius: r.borderRadiusExpandable,
            padding: r.expandablePadding,
            marginTop: r.expandableMarginTop,
            marginHorizontal: r.expandableMarginHorizontal,
            overflow: 'hidden',
            shadowColor: '#000', // Ombre
            shadowOffset: { width: 0, height: 4 }, // Ombre
            shadowOpacity: 0.3, // Ombre
            shadowRadius: 6, // Ombre
            elevation: 8, // Ombre pour Android
          }}
        >
          <RepasBox titre="DÉJEUNER" joursActifs={['Lun', 'Mer', 'Jeu', 'Ven', 'Sam']} />
          <Animated.View style={{ height: menuHeight, overflow: 'hidden' }}>
            <RepasBox titre="DINER" joursActifs={['Lun', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']} />
            <RepasBox titre="PETIT-DÉJEUNER" joursActifs={[]} />
          </Animated.View>
          <TouchableOpacity onPress={toggleExpand} style={{ alignItems: 'center', marginTop: r.repasBoxTitleMarginTop }}>
            {expanded ? (
              <Entypo name="chevron-up" size={r.iconSize} color="white" />
            ) : (
              <Entypo name="chevron-down" size={r.iconSize} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <Animated.View
          style={{
            marginTop: marginTopAnimation,
            paddingHorizontal: r.paddingHorizontal,
            paddingTop: r.paddingTop,
          }}
        >
         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: r.optionBoxSpacing }}>
            <OptionBox
              iconName="ticket"
              titre="ACHETER DES TICKETS"
              sousTitre=""
              bgColor="VeryLightYellow"
              onPress={toggleTicketModal}
              iconColor={bgColors.VeryLightYellow.iconColor || '#000000'}
            />
            <OptionBox
              iconName="calendar"
              titre="FAIRE UNE RÉSERVATION"
              sousTitre=""
              bgColor="VeryLightGreen"
              onPress={toggleReserveModal}
              iconColor={bgColors.VeryLightGreen.iconColor || '#000000'}
            />
          </View>

          <View className="flex-row">
            <View className="w-1/2 pr-2 ">
              <OptionBox
                iconName="wallet"
                titre="RECHARGER MON COMPTE"
                sousTitre=""
                bgColor="VeryLightRed"
                onPress={toggleReloadModal}
                iconColor={bgColors.VeryLightRed.iconColor || '#000000'}
              />
            </View>
            <View className="w-1/2" />
          </View>
        </Animated.View>
        <View style={{ height: r.bottomNavBarHeight + r.paddingBottomForScroll }} />
      </ScrollView>

      {/* BARRE DE NAVIGATION INFÉRIEURE - MODIFIÉ */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: r.bottomNavPaddingVertical,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
          borderTopLeftRadius: 10, // Ajoutez ici un rayon pour le coin supérieur gauche
          borderTopRightRadius: 10, // Ajoutez ici un rayon pour le coin supérieur droit
        }}
      >
         <TouchableOpacity
          className="items-center"
          onPress={() => {
            setSelectedTab('notif');
            router.push('/Screens/notificationPage'); // Navigue vers la page de notifications
          }}
        >
          <Feather name="bell" size={r.bottomNavIconSize} color={selectedTab === 'notif' ? '#3B82F6' : 'lightgray'} />
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => setSelectedTab('home')}>
          <Feather name="home" size={r.bottomNavIconSize} color={selectedTab === 'home' ? '#3B82F6' : 'lightgray'} />
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => setSelectedTab('profile')}>
          <Feather name="user" size={r.bottomNavIconSize} color={selectedTab === 'profile' ? '#3B82F6' : 'lightgray'} />
        </TouchableOpacity>
      </View>

      <TicketBottomSheet isVisible={isTicketModalVisible} toggleBottomSheet={toggleTicketModal} />
      <ReserveBottomSheet isVisible={isReserveModalVisible} toggleBottomSheet={toggleReserveModal} />
      <ReloadBottomSheet isVisible={isReloadModalVisible} toggleBottomSheet={toggleReloadModal} />

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleBottomSheet}
        swipeDirection="down"
        onSwipeComplete={toggleBottomSheet}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View>
        </View>
      </Modal>
    </View>
  );
}