import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

const TICKET_PRICES = {
  "petitDej": 80,
  "dejDiner": 125,
};

interface BuyTicketBottomSheetProps {
  isVisible: boolean;
  toggleBottomSheet: () => void;
}

type TicketType = "PETIT-DÉJEUNER" | "DÉJEUNER / DÎNER" | "";

const BuyTicketBottomSheet: React.FC<BuyTicketBottomSheetProps> = ({ isVisible, toggleBottomSheet }) => {
  const [step, setStep] = useState(1);
  const [petitDejCount, setPetitDejCount] = useState('0');
  const [dejDinerCount, setDejDinerCount] = useState('0');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType>('');
  const [amountDebited, setAmountDebited] = useState(0);

  const totalPricePetitDej = (parseInt(petitDejCount) || 0) * TICKET_PRICES.petitDej;
  const totalPriceDejDiner = (parseInt(dejDinerCount) || 0) * TICKET_PRICES.dejDiner;
  const totalPrice = totalPricePetitDej + totalPriceDejDiner;

  const handleConfirm = () => {
    const compteDisponible = 10000;
    if (totalPrice > compteDisponible) {
      setShowFailure(true);
    } else {
      setAmountDebited(totalPrice);
      setShowSuccess(true);
    }
    setShowConfirmationModal(false);
  };

  const reset = () => {
    setStep(1);
    setPetitDejCount('0');
    setDejDinerCount('0');
    setShowFailure(false);
    setShowSuccess(false);
    setShowConfirmationModal(false);
    setSelectedTicketType('');
    setAmountDebited(0);
    toggleBottomSheet();
  };

  const goToQuantityStep = (ticketType: TicketType) => {
    setSelectedTicketType(ticketType);
    setStep(2);
  };

  const goToConfirmationStep = () => {
    setShowConfirmationModal(true);
  };

  const incrementCount = (ticketType: TicketType) => {
    if (ticketType === "PETIT-DÉJEUNER") {
      setPetitDejCount(String(parseInt(petitDejCount) + 1));
    } else if (ticketType === "DÉJEUNER / DÎNER") {
      setDejDinerCount(String(parseInt(dejDinerCount) + 1));
    }
  };

  const decrementCount = (ticketType: TicketType) => {
    if (ticketType === "PETIT-DÉJEUNER" && parseInt(petitDejCount) > 0) {
      setPetitDejCount(String(parseInt(petitDejCount) - 1));
    } else if (ticketType === "DÉJEUNER / DÎNER" && parseInt(dejDinerCount) > 0) {
      setDejDinerCount(String(parseInt(dejDinerCount) - 1));
    }
  };

  return (
    <>
      <Modal
        isVisible={isVisible}
        onBackdropPress={toggleBottomSheet}
        swipeDirection="down"
        onSwipeComplete={toggleBottomSheet}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        {step === 1 && (
          <View className="bg-white rounded-t-3xl px-6 " style={{ height: 300 }}>
           <View className="items-center">
    <TouchableOpacity
      onPress={toggleBottomSheet}
      className="bg-red-500 w-32 h-12 rounded-b-xl items-center justify-center shadow mb-8"
    >
      <AntDesign name="close" size={24} color="white" />
    </TouchableOpacity>
  </View>
            <Text className="text-center text-blue-700 font-semibold text-lg mb-8">
              ACHETER LES TICKETS :
            </Text>

            <TouchableOpacity
              onPress={() => goToQuantityStep("PETIT-DÉJEUNER")}
              className="bg-blue-600 p-4 rounded-xl shadow-lg "
            >
              <Text className="text-center text-white font-semibold">PETIT-DÉJEUNER</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => goToQuantityStep("DÉJEUNER / DÎNER")}
              className="bg-blue-600 p-4 rounded-xl shadow-lg mt-4"
            >
              <Text className="text-center text-white font-semibold">DÉJEUNER / DÎNER</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View className="bg-white rounded-t-3xl px-6 " style={{ height: 400 }}>
            <View className="items-center mb-4">
              <TouchableOpacity
                onPress={() => setStep(1)}
                className="bg-red-500 w-32 h-12 rounded-b-xl items-center justify-center mb-8"
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="text-center text-blue-700 font-semibold text-lg mb-10">
              SÉLECTIONNEZ LE NOMBRE DE TICKET {'\n'} {selectedTicketType}
            </Text>

            <View className="bg-gray-200 rounded-xl flex-row items-center justify-around px-5 py-3 mb-6 shadow">
              <TouchableOpacity onPress={() => decrementCount(selectedTicketType)}>
                <Text className="text-2xl font-bold text-blue-700">-</Text>
              </TouchableOpacity>
              <TextInput
                className="rounded-md p-2 text-black font-bold w-20 text-center"
                keyboardType="numeric"
                value={selectedTicketType === "PETIT-DÉJEUNER" ? petitDejCount : dejDinerCount}
                onChangeText={(text) => {
                  if (selectedTicketType === "PETIT-DÉJEUNER") setPetitDejCount(text);
                  else setDejDinerCount(text);
                }}
              />
              <TouchableOpacity onPress={() => incrementCount(selectedTicketType)}>
                <Text className="text-2xl font-bold text-blue-700">+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={goToConfirmationStep}
              className="bg-blue-600 p-4 rounded-xl shadow-lg mt-8"
            >
              <Text className="text-white text-center font-bold">SUIVANT</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>

      {/* MODAL DE CONFIRMATION */}
      <Modal isVisible={showConfirmationModal} onBackdropPress={() => setShowConfirmationModal(false)} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View className="bg-white p-6 rounded-2xl w-96">
          <Text className="text-2xl font-bold text-center mb-6">CONFIRMATION</Text>
          {parseInt(dejDinerCount) > 0 && (
            <Text className="text-center mb-2 text-lg">
              {dejDinerCount} ticket(s) Déj/Dîner à {TICKET_PRICES.dejDiner} FCFA
            </Text>
          )}
          {parseInt(petitDejCount) > 0 && (
            <Text className="text-center mb-4 text-lg">
              Confirmez-vous l'achat de {petitDejCount} ticket(s) : {'\n'} PETIT-DÉJEUNER {'\n'} à {TICKET_PRICES.petitDej} FCFA
            </Text>
          )}
          <Text className="text-center font-bold mb-4 text-green-500 text-2xl">
            Total : {totalPrice} FCFA
          </Text>
          <TouchableOpacity onPress={handleConfirm} className="bg-green-500 p-4 rounded-xl mt-2 mb-2">
            <Text className="text-white text-center font-bold text-lg">CONFIRMER</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowConfirmationModal(false)} className="bg-red-500 p-4 rounded-xl">
            <Text className="text-center font-bold text-white text-lg">RETOUR</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* SUCCÈS */}
      <Modal isVisible={showSuccess} onBackdropPress={reset} onSwipeComplete={reset} swipeDirection="down">
        <View className="bg-white p-6 rounded-2xl items-center">
          <AntDesign name="checkcircle" size={64} color="green" />
          <Text className="font-bold text-center mt-3 text-green-600 text-2xl">
            Achat effectué avec succès !
          </Text>
          {amountDebited > 0 && (
            <Text className="text-center mt-2 text-gray-700 text-lg">
              Solde débité : {amountDebited} FCFA
            </Text>
          )}
          {selectedTicketType && (
            <Text className="text-center mt-2 text-gray-700 text-lg">
              Ticket : {selectedTicketType}
              {selectedTicketType === "PETIT-DÉJEUNER" && petitDejCount ? ` (x${petitDejCount})` : ''}
              {selectedTicketType === "DÉJEUNER / DÎNER" && dejDinerCount ? ` (x${dejDinerCount})` : ''}
            </Text>
          )}
          <TouchableOpacity onPress={reset} className="mt-4 bg-green-500 px-4 py-2 rounded-lg">
            <Text className="text-white font-bold text-lg">OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* ÉCHEC */}
      <Modal isVisible={showFailure} onBackdropPress={() => setShowFailure(false)} onSwipeComplete={() => setShowFailure(false)} swipeDirection="down">
        <View className="bg-white p-6 rounded-2xl items-center">
          <MaterialIcons name="error-outline" size={64} color="red" />
          <Text className="text-lg font-bold text-center mt-3 text-red-600">
            Veuillez recharger votre compte
          </Text>
          <TouchableOpacity onPress={() => setShowFailure(false)} className="mt-4 bg-gray-300 px-4 py-2 rounded-lg">
            <Text className="text-gray-800 font-bold">Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default BuyTicketBottomSheet;